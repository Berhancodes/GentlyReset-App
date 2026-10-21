"""Gently Reset — 2026 after-tax profit model (planning estimate, not tax advice).

Run:  python3 docs/release/profit_model.py

Sole proprietor in Alberta with employment income. Incremental method:
tax_and_cpp(employment + profit) - tax_and_cpp(employment), so the job's own
tax and credits cancel out and only what the app adds is counted.
Every constant is listed with its source or as an ASSUMPTION in
GENTLY_RESET_AFTER_TAX_PROFIT_ANALYSIS.md.
"""

# ---------------------------------------------------------------- 2026 rules
FED_BRACKETS = [(58_523, 0.14), (117_045, 0.205), (181_440, 0.26), (258_482, 0.29), (float('inf'), 0.33)]
AB_BRACKETS = [(61_200, 0.08), (154_259, 0.10), (185_111, 0.12), (246_813, 0.13), (370_220, 0.14), (float('inf'), 0.15)]
FED_CREDIT_RATE = 0.14
AB_CREDIT_RATE = 0.08            # ASSUMPTION (TaxTips): Alberta credits at the 8% lowest rate
FED_BPA_MAX, FED_BPA_MIN = 16_452, 14_829
AB_BPA = 22_769                  # ASSUMPTION: 2025 $22,323 indexed 2%

YMPE, YAMPE, CPP_EXEMPT = 74_600, 85_000, 3_500
CPP1_SE, CPP2_SE = 0.119, 0.08   # self-employed (both halves)
CPP1_EMP, CPP2_EMP = 0.0595, 0.04

# ------------------------------------------------------------ app economics
PRICE_MONTHLY_USD, PRICE_ANNUAL_USD = 9.99, 59.99
FX = 1.4154                      # Bank of Canada USD/CAD, Oct 16 2026
FX_LOW, FX_HIGH = 1.38, 1.44     # ASSUMPTION: planning range
REFUND_RATE = 0.03               # ASSUMPTION
SBP_COMMISSION, STD_COMMISSION = 0.15, 0.30


def bracket_tax(income, brackets):
    tax, lower = 0.0, 0.0
    for upper, rate in brackets:
        if income <= lower:
            break
        tax += (min(income, upper) - lower) * rate
        lower = upper
    return tax


def fed_bpa(net_income):
    if net_income <= 181_440:
        return FED_BPA_MAX
    if net_income >= 258_482:
        return FED_BPA_MIN
    return FED_BPA_MAX - (FED_BPA_MAX - FED_BPA_MIN) * (net_income - 181_440) / (258_482 - 181_440)


def employment_cpp(e):
    cpp1 = CPP1_EMP * max(0.0, min(e, YMPE) - CPP_EXEMPT)
    cpp2 = CPP2_EMP * max(0.0, min(e, YAMPE) - YMPE)
    return cpp1, cpp2


def se_cpp(e, p):
    """Self-employed CPP on profit p, given employment earnings e already contributed."""
    base1 = max(0.0, min(e + p, YMPE) - max(min(e, YMPE), CPP_EXEMPT))
    base2 = max(0.0, min(e + p, YAMPE) - max(min(e, YAMPE), YMPE))
    return CPP1_SE * base1, CPP2_SE * base2, base1


def tax_and_cpp(e, p):
    """Income tax (fed + AB) plus CPP for employment e and business profit p."""
    emp1, emp2 = employment_cpp(e)
    se1, se2, se_base1 = se_cpp(e, p)
    # Deductions: enhanced CPP (1% of 5.95% employee share), CPP2 employee share,
    # and for self-employed: employer half of CPP1 + enhanced 1% + all of CPP2.
    emp_enh_deduction = emp1 * (1.0 / 5.95) + emp2
    se_deduction = se_base1 * (0.0595 + 0.01) + se2
    net = e + p - emp_enh_deduction - se_deduction
    # Credits on the base CPP (4.95% of contributory earnings) for each role.
    base_cpp_credit_amount = emp1 * (4.95 / 5.95) + se_base1 * 0.0495
    fed = bracket_tax(net, FED_BRACKETS) - FED_CREDIT_RATE * (fed_bpa(net) + base_cpp_credit_amount)
    ab = bracket_tax(net, AB_BRACKETS) - AB_CREDIT_RATE * (AB_BPA + base_cpp_credit_amount)
    return max(fed, 0) + max(ab, 0) + emp1 + emp2 + se1 + se2


def incremental(e, p):
    return tax_and_cpp(e, p) - tax_and_cpp(e, 0)


def marginal_rate(e, p, step=100.0):
    return (tax_and_cpp(e, p + step) - tax_and_cpp(e, p)) / step


def proceeds_cad(price_usd, commission=SBP_COMMISSION, fx=FX, refunds=REFUND_RATE):
    return price_usd * (1 - refunds) * (1 - commission) * fx


# Annual fixed costs in CAD (ASSUMPTIONS; see report). Tiered by scale.
def fixed_costs_cad(monthly_subs):
    apple_dev = 99 * FX
    domain_site = 60
    accounting = 600 if monthly_subs < 500 else 1_500 if monthly_subs < 2_000 else 3_000
    supabase = 0 if monthly_subs < 500 else 25 * 12 * FX if monthly_subs < 5_000 else 100 * 12 * FX
    sentry = 0 if monthly_subs < 1_000 else 26 * 12 * FX
    content_tools = 22 * 12 * FX  # ElevenLabs-type voice plan for reels
    return apple_dev + domain_site + accounting + supabase + sentry + content_tools


def revenuecat_cad(gross_usd_month):
    # ASSUMPTION: free under $2.5k monthly tracked revenue, then 1% of MTR.
    return 0.0 if gross_usd_month <= 2_500 else 0.01 * gross_usd_month * 12 * FX


JOBS = {hours: round(34.50 * hours * 52, 2) for hours in (20, 30, 40, 50)}


def per_sub_table():
    rows = []
    for hours, e in JOBS.items():
        m_net = proceeds_cad(PRICE_MONTHLY_USD) * 12   # one monthly sub kept 12 months
        a_net = proceeds_cad(PRICE_ANNUAL_USD)
        # Marginal tax+CPP rate on the first few thousand of profit.
        rate = marginal_rate(e, 1_000)
        rows.append((hours, e, rate, m_net / 12 * (1 - rate), a_net * (1 - rate)))
    return rows


def scale_table(e):
    rows = []
    for n in (100, 500, 1_000, 2_000, 5_000, 10_000):
        gross_usd_month = n * PRICE_MONTHLY_USD
        gross_cad = gross_usd_month * 12 * FX
        refunds = gross_cad * REFUND_RATE
        kept = gross_cad - refunds
        # SBP applies until $1M USD proceeds in the calendar year, then 30%.
        proceeds_usd_at_15 = gross_usd_month * 12 * (1 - REFUND_RATE) * 0.85
        if proceeds_usd_at_15 <= 1_000_000:
            commission = kept * SBP_COMMISSION
        else:
            gross_at_cap = 1_000_000 / 0.85
            commission = gross_at_cap * FX * 0.15 + (kept - gross_at_cap * FX) * 0.30
        proceeds = kept - commission
        expenses = fixed_costs_cad(n) + revenuecat_cad(gross_usd_month)
        profit = proceeds - expenses
        tax = incremental(e, profit)
        after = profit - tax
        rows.append((n, gross_cad, commission, proceeds, expenses, tax, after, after / n / 12, marginal_rate(e, profit)))
    return rows


def corp_compare(e, profit):
    """Illustrative: corporation pays 11% and either keeps it or pays a non-eligible dividend."""
    corp_tax = profit * 0.11
    retained = profit - corp_tax
    gross_up = retained * 1.15
    # Dividend taxed on top of employment; non-eligible DTC fed 9.0301%, AB 2.18% of grossed-up.
    personal = (tax_and_cpp(e + gross_up, 0) - tax_and_cpp(e, 0)) - gross_up * (0.090301 + 0.0218)
    sole = incremental(e, profit)
    return corp_tax, retained, personal, retained - personal, profit - sole


if __name__ == '__main__':
    print(f'FX {FX}  refunds {REFUND_RATE:.0%}')
    for price, label in ((PRICE_MONTHLY_USD, 'monthly'), (PRICE_ANNUAL_USD, 'annual')):
        print(f'{label}: USD {price}  15% -> USD {price*0.85:.2f}  30% -> USD {price*0.70:.2f}  '
              f'CAD after 15% (no refunds) {price*0.85*FX:.2f}  after refunds {proceeds_cad(price):.2f}  '
              f'range {proceeds_cad(price, fx=FX_LOW):.2f}-{proceeds_cad(price, fx=FX_HIGH):.2f}')
    print('\nPer subscriber by job hours (marginal tax+CPP on first app dollars):')
    for hours, e, rate, m, a in per_sub_table():
        print(f'{hours}h/wk  job ${e:,.0f}  marginal {rate:.1%}  monthly keep ${m:.2f}/mo  annual keep ${a:.2f}/yr')
    print('\nMarginal rate as app profit grows (40h job):')
    for p in (0, 2_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000):
        print(f'  profit ${p:>7,}: marginal {marginal_rate(JOBS[40], p):.1%}  '
              f'avg on app income {incremental(JOBS[40], p) / p if p else 0:.1%}')
    print('\nScale (monthly subs only, 40h job):')
    for r in scale_table(JOBS[40]):
        print('  {:>6,} subs  gross ${:>12,.0f}  apple ${:>11,.0f}  proceeds ${:>12,.0f}  exp ${:>8,.0f}  '
              'tax+cpp ${:>11,.0f}  after ${:>12,.0f}  per sub/mo ${:.2f}  marginal {:.1%}'.format(*r))
    print('\nCorporation illustration (40h job):')
    for p in (25_000, 100_000, 300_000):
        ct, ret, pers, net_div, net_sole = corp_compare(JOBS[40], p)
        print(f'  profit ${p:,}: corp tax ${ct:,.0f}, kept in corp ${ret:,.0f}; '
              f'if paid out as dividend you net ${net_div:,.0f} vs sole proprietor ${net_sole:,.0f}')
