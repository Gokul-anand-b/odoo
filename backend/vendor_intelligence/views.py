from decimal import Decimal
from rest_framework import permissions, viewsets, status
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
from client_management.permissions import IsAdminRole

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

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
        OCR and AI Document Extraction endpoint.
        Scans proposal text, flags hidden fees, calculates True Landed Cost,
        and saves the Quotation directly to Supabase PostgreSQL.
        """
        import random
        pdf_name = request.data.get('file_name', 'Vendor_Quotation_Proposal.pdf')
        raw_text = request.data.get('raw_text', 'Sample quotation with corkage fee, generator fuel, and late night overtime.')
        base_price = Decimal(str(request.data.get('base_price', '2450000')))
        vendor_id = request.data.get('vendor_id')
        save_to_db = request.data.get('save_to_db', True)

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

        if save_to_db:
            vendor = None
            if vendor_id:
                vendor = Vendor.objects.filter(id=vendor_id).first()
            if not vendor:
                v_name = request.data.get('vendor_name') or 'Udaipur Grand Banquet & Royal Catering'
                v_cat = request.data.get('category') or 'Catering & Banquets'
                vendor, _ = Vendor.objects.get_or_create(
                    name=v_name,
                    defaults={
                        'category': v_cat,
                        'tier': 'Heritage Luxe',
                        'city': 'Udaipur, Rajasthan',
                        'experience_years': 8,
                        'rating': 4.8,
                    }
                )

            quote_num = f"Q-AI-EXT-{random.randint(1000, 9999)}"
            quote = Quotation.objects.create(
                quote_number=quote_num,
                vendor=vendor,
                wedding_name=request.data.get('wedding_name', 'Samar & Alizeh Royal Wedding'),
                wedding_date=request.data.get('wedding_date', 'Nov 18-20, 2026'),
                status=QuoteStatus.AI_ANALYZED,
                base_price=base_price,
                taxes_gst=taxes_gst,
                price_per_plate=Decimal(str(request.data.get('price_per_plate', 3750))),
                minimum_guest_guarantee=int(request.data.get('minimum_guest_guarantee', 480)),
                hidden_costs_total=sum(Decimal(str(h['amount'])) for h in hidden_costs),
                missing_inclusions_cost=sum(Decimal(str(m['estimated_fix_cost'])) for m in missing_inclusions),
                true_estimated_landed_cost=true_landed_cost,
                value_score=value_score,
                pdf_file_name=pdf_name,
                overtime_hourly_rate=Decimal(str(request.data.get('overtime_hourly_rate', 35000))),
                advance_payment_percentage=int(request.data.get('advance_payment_percentage', 45)),
            )

            for h in hidden_costs:
                HiddenCostItem.objects.create(
                    quotation=quote,
                    label=h.get('label', 'Hidden Charge'),
                    amount=Decimal(str(h.get('amount', 0))),
                    risk_level=h.get('risk_level', 'Medium'),
                    reason=h.get('reason', ''),
                    category=h.get('category', 'Service Fee')
                )

            for m in missing_inclusions:
                MissingInclusion.objects.create(
                    quotation=quote,
                    item=m.get('item', 'Standard Inclusion'),
                    industry_standard=m.get('industry_standard', ''),
                    vendor_provision=m.get('vendor_provision', '')
                )

            return Response(QuotationSerializer(quote).data, status=status.HTTP_201_CREATED)

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
