from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vendor, Quotation, QuoteLineItem, HiddenCostItem, MissingInclusion, QuoteStatus
from .serializers import (
    VendorSerializer, 
    QuotationSerializer, 
    QuoteLineItemSerializer, 
    HiddenCostItemSerializer, 
    MissingInclusionSerializer
)
from .services.quote_comparator import QuoteComparator
from .services.hidden_cost_detector import HiddenCostDetector

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        tier = self.request.query_params.get('tier')
        if category and category != 'All':
            qs = qs.filter(category=category)
        if tier and tier != 'All':
            qs = qs.filter(tier=tier)
        return qs


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all().select_related('vendor').prefetch_related('items', 'hidden_costs', 'missing_inclusions')
    serializer_class = QuotationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        status_filter = self.request.query_params.get('status')
        if category and category != 'All':
            qs = qs.filter(vendor__category=category)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=False, methods=['get'])
    def compare(self, request):
        """
        Scenario 2: Structured Quotation Comparison.
        Returns side-by-side comparison matrix with True Landed Cost and Value Scores.
        """
        category = request.query_params.get('category', 'Catering & Banquets')
        quotes = self.get_queryset().filter(vendor__category=category)

        serialized = QuotationSerializer(quotes, many=True).data

        # Determine best value quote
        recommended_id = None
        highest_score = -1
        for q in serialized:
            if q.get('value_score', 0) > highest_score:
                highest_score = q.get('value_score', 0)
                recommended_id = q.get('id')

        return Response({
            'category': category,
            'total_proposals': len(serialized),
            'recommended_quote_id': recommended_id,
            'quotations': serialized,
        })

    @action(detail=True, methods=['post'], url_path='select-winner')
    def select_winner(self, request, pk=None):
        """
        Scenario 2: Once a vendor is selected, close the other quotation requests.
        """
        quote = self.get_object()
        category = quote.vendor.category

        # 1. Award contract to this quote
        quote.status = QuoteStatus.SELECTED
        quote.save(update_fields=['status', 'updated_at'])

        # 2. Automatically close rival quotations in the same category
        competitor_quotes = Quotation.objects.filter(
            vendor__category=category
        ).exclude(id=quote.id)

        closed_count = competitor_quotes.update(status=QuoteStatus.CLOSED)

        return Response({
            'message': f"Contract officially awarded to {quote.vendor.name}.",
            'selected_quote_id': quote.id,
            'category': category,
            'closed_rival_quotes_count': closed_count,
            'advance_payment_percentage': quote.advance_payment_percentage,
            'advance_due_amount': float(quote.base_price * Decimal(str(quote.advance_payment_percentage / 100))),
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='extract-pdf')
    def extract_pdf(self, request):
        """
        Simulated OCR and AI Document Extraction endpoint.
        Scans proposal text, flags hidden fees, and calculates True Landed Cost.
        """
        pdf_name = request.data.get('file_name', 'Vendor_Quotation_Proposal.pdf')
        raw_text = request.data.get('raw_text', 'Sample quotation with corkage fee, generator fuel, and late night overtime.')
        base_price = Decimal(str(request.data.get('base_price', '2450000')))
        vendor_id = request.data.get('vendor_id')

        # 1. Run rule-based detection
        scan_results = HiddenCostDetector.scan_proposal_text(raw_text)
        hidden_costs = scan_results['hidden_costs']
        missing_inclusions = scan_results['missing_inclusions']

        # 2. Compute GST (5% catering or 18% decor)
        taxes_gst = base_price * Decimal('0.05')

        # 3. Compute True Landed Cost
        true_landed_cost = QuoteComparator.calculate_landed_cost(
            base_price=base_price,
            taxes_gst=taxes_gst,
            hidden_costs=hidden_costs,
            missing_inclusions=missing_inclusions
        )

        # 4. Compute Value Score
        value_score = QuoteComparator.calculate_value_score(
            vendor_rating=4.5,
            base_price=base_price,
            landed_cost=true_landed_cost,
            missing_count=len(missing_inclusions),
            verified=True
        )

        return Response({
            'pdf_file_name': pdf_name,
            'base_price': float(base_price),
            'taxes_gst': float(taxes_gst),
            'hidden_costs_total': float(sum(h['amount'] for h in hidden_costs)),
            'missing_inclusions_cost': float(sum(m['estimated_fix_cost'] for m in missing_inclusions)),
            'true_estimated_landed_cost': float(true_landed_cost),
            'value_score': value_score,
            'hidden_costs': hidden_costs,
            'missing_inclusions': missing_inclusions,
        }, status=status.HTTP_200_OK)
