from decimal import Decimal

class QuoteComparator:
    """
    Core Domain Service for Core Feature 2:
    Smart Vendor Intelligence & Quote Comparison.
    
    Computes True Landed Cost and multi-criteria Value-for-Money Score.
    """

    @staticmethod
    def calculate_landed_cost(base_price: Decimal, taxes_gst: Decimal, hidden_costs: list, missing_inclusions: list) -> Decimal:
        """
        True Estimated Landed Cost = Base Price + GST + Hidden Fineprint Fees + Missing Fix Costs
        """
        hidden_sum = sum(Decimal(str(item.get('amount', 0))) for item in hidden_costs)
        missing_sum = sum(Decimal(str(item.get('estimated_fix_cost', 0))) for item in missing_inclusions)
        return Decimal(str(base_price)) + Decimal(str(taxes_gst)) + hidden_sum + missing_sum

    @staticmethod
    def calculate_value_score(vendor_rating: float, base_price: Decimal, landed_cost: Decimal, missing_count: int, verified: bool) -> int:
        """
        4-Factor Value-for-Money Decision Index (0 - 100):
        1. Cost Transparency (40%): Ratio of advertised base price to true landed cost.
        2. Vendor Quality Tier & Rating (30%): Scaled 0-5 rating.
        3. Inclusion Completeness (20%): Penalizes unincluded industry-standard items.
        4. Operational Track Record & Verification (10%): Verified supplier bonus.
        """
        # 1. Cost Transparency Factor (0 to 40 pts)
        if landed_cost <= 0:
            transparency_score = 40.0
        else:
            ratio = float(base_price / landed_cost) # e.g. 28.5L / 31.17L = 0.914 -> 36.5 pts
            transparency_score = max(10.0, min(40.0, ratio * 40.0))

        # 2. Quality & Rating Factor (0 to 30 pts)
        rating_score = (vendor_rating / 5.0) * 30.0

        # 3. Inclusion Completeness Factor (0 to 20 pts)
        inclusion_score = max(0.0, 20.0 - (missing_count * 7.0))

        # 4. Operational Track Record (0 to 10 pts)
        verification_score = 10.0 if verified else 5.0

        total = int(round(transparency_score + rating_score + inclusion_score + verification_score))
        return max(1, min(100, total))
