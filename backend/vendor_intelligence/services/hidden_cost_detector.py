import re

class HiddenCostDetector:
    """
    Automated Rule-Based AI Engine for discovering fine-print surcharges
    and missing wedding inclusions from supplier quotations.
    """

    FINEPRINT_RULES = [
        {
            'pattern': r'(corkage|liquor bottle|bar handling)',
            'label': 'Imported Liquor Corkage Levy (₹750 - ₹900/btl)',
            'category': 'Corkage',
            'amount': 215000,
            'risk_level': 'High',
            'reason': 'Vendor levies per-bottle handling fees when client provides custom bar stock.',
        },
        {
            'pattern': r'(overtime|midnight|after 11|post 1:)',
            'label': 'Late-Night Overtime Surcharge Penalty',
            'category': 'Overtime',
            'amount': 180000,
            'risk_level': 'High',
            'reason': 'Mandatory hourly penalties applied if sangeet or celebration extends beyond scheduled curfew.',
        },
        {
            'pattern': r'(generator|diesel|genset|power draw|kwh)',
            'label': 'Live Kitchen Commercial Generator Fuel Surcharge',
            'category': 'Power/Fuel',
            'amount': 120000,
            'risk_level': 'Medium',
            'reason': 'Palace courtyard electrical loads require external mobile generator diesel fueling.',
        },
        {
            'pattern': r'(breakage|deposit|damage contingency|brass)',
            'label': 'Cutlery Polishing & Breakage Contingency Deposit',
            'category': 'Breakage Deposit',
            'amount': 150000,
            'risk_level': 'Low',
            'reason': 'Non-refundable fee for heritage chafing dish maintenance.',
        },
    ]

    INCLUSION_STANDARDS = [
        {
            'keyword': 'glassware',
            'item': 'Crystal Cut Glassware & Champagne Stemware',
            'standard': 'Standard provision in luxury 5-star palace catering',
            'fix_cost': 140000,
            'severity': 'Critical',
        },
        {
            'keyword': 'waste',
            'item': 'Post-Event Kitchen Deep Clean & Waste Disinfection',
            'standard': 'Mandatory Archaeological/Palace Conservation Authority requirement',
            'fix_cost': 120000,
            'severity': 'Critical',
        },
    ]

    @classmethod
    def scan_proposal_text(cls, text: str) -> dict:
        text_lower = text.lower()
        detected_hidden = []
        missing_inclusions = []

        # 1. Check fineprint patterns
        for rule in cls.FINEPRINT_RULES:
            if re.search(rule['pattern'], text_lower):
                detected_hidden.append({
                    'label': rule['label'],
                    'category': rule['category'],
                    'amount': rule['amount'],
                    'risk_level': rule['risk_level'],
                    'reason': rule['reason'],
                })

        # 2. Check missing standards
        for std in cls.INCLUSION_STANDARDS:
            if std['keyword'] not in text_lower:
                missing_inclusions.append({
                    'item': std['item'],
                    'industry_standard': std['standard'],
                    'vendor_provision': 'Excluded from base proposal',
                    'estimated_fix_cost': std['fix_cost'],
                    'severity': std['severity'],
                })

        return {
            'hidden_costs': detected_hidden,
            'missing_inclusions': missing_inclusions,
        }
