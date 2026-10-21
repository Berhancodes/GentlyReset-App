# Gently Reset — After-Tax Profit per Subscriber (2026)

**For planning only. Not tax advice.** Items marked **CPA** need a Canadian accountant's confirmation.
**Model:** `docs/release/profit_model.py` (run `python3 docs/release/profit_model.py`). Every number below comes from it.
**Labels:** **FACT** from an official or primary source · **ASSUMPTION** my input, change it in the model · **ESTIMATE** a result of the two.

## 1. Inputs

| Input | Value | Type |
|---|---|---|
| Prices | **USD 9.99 / month, USD 59.99 / year**, set in App Store Connect; other storefronts auto-equalized (Canada yearly CA$79.99) | FACT (you confirmed in App Store Connect) |
| Price tax treatment | US and Canada storefront prices are shown **before** sales tax; Apple adds and remits the tax. Proceeds are calculated on the pre-tax price. | FACT (Apple), check your Sales report |
| Apple commission | **15%** with the Small Business Program (SBP) · **30%** standard; standard-rate subscriptions drop to 15% after a subscriber's first paid year | FACT ([Apple SBP](https://developer.apple.com/app-store/small-business-program/)) |
| SBP enrollment | **Not automatic.** You must enroll; the rate starts 15 days after the fiscal month you're approved | FACT (same page) · **status unverified** |
| FX | **1.4154 CAD per USD** (Bank of Canada, Oct 16 2026); planning range 1.38–1.44 | FACT + ASSUMPTION range |
| Refunds / chargebacks | 3% of gross | ASSUMPTION |
| Business structure | Sole proprietor (individual), Alberta | ASSUMPTION from project docs, **confirm** |
| Job | CAD 34.50/h × 52 weeks: 20h = $35,880 · 30h = $53,820 · 40h = $71,760 · 50h = $89,700 | ASSUMPTION (52 paid weeks) |
| Fixed costs | Apple Developer USD 99/yr, domain/site $60, accounting $600–3,000, Supabase USD 0–100/mo, Sentry USD 0–26/mo, voice tool USD 22/mo (tiered by scale) | ASSUMPTION |
| RevenueCat | free under USD 2.5k monthly tracked revenue, then 1% | ASSUMPTION, check RevenueCat pricing |
| Payment processing | none extra; Apple's commission covers it (not double-counted) | FACT |

### 2026 tax rules used

| Rule | Value | Source |
|---|---|---|
| Federal brackets | 14% to $58,523 · 20.5% to $117,045 · 26% to $181,440 · 29% to $258,482 · 33% above; personal amount $16,452 | FACT, CRA 2026 indexation (2.0%) ([CP24/CRA](https://www.cp24.com/news/money/2025/12/01/heres-how-much-you-will-be-taxed-in-2026-canada-revenue-agency), [Harvest](https://harvestportfolios.com/cra-announces-federal-tax-bracket-thresholds-for-2026/)) |
| Alberta brackets | 8% to $61,200 · 10% to $154,259 · 12% to $185,111 · 13% to $246,813 · 14% to $370,220 · 15% above | FACT ([alberta.ca/personal-income-tax](https://www.alberta.ca/personal-income-tax)) |
| Alberta personal amount / credit rate | $22,769 at 8% | ASSUMPTION from secondary sources ([TaxTips](https://www.taxtips.ca/abtax/personal-tax-credits.htm)); **CPA** |
| CPP 2026 | YMPE $74,600, exemption $3,500, 5.95% employee, **11.9% self-employed**, max self-employed $8,460.90 | FACT ([CRA CPP rates](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html)) |
| CPP2 2026 | YAMPE $85,000; 4% employee / **8% self-employed** on $74,600–$85,000 | secondary ([Payworks](https://blog.payworks.ca/cpp2-and-qpp2-explained-what-canadian-employers-need-to-know)); **confirm on the CRA CPP2 page** |
| CPP tax treatment | Self-employed: employer half of CPP1 + the enhanced 1% + all CPP2 are **deductions**; base 4.95% gets a **credit** | FACT (CRA rules) |
| Small-business corporate rate | 9% federal + 2% Alberta = **11%** on first $500k active income | secondary ([TaxTips 2026](https://www.taxtips.ca/smallbusiness/corporatetax/corporate-tax-rates-2026.htm)) |
| GST/HST | Small supplier under **$30,000** of worldwide taxable supplies over four quarters | FACT (CRA) |

### Four different percentages that are easy to confuse

1. **Apple's commission** (15% or 30%): Apple's cut of the price.
2. **GST/HST/sales tax**: added on top of the price for the customer. Apple collects and remits it on App Store sales. It is not your income.
3. **Income tax**: federal + Alberta, on your **profit**.
4. **CPP**: pension contributions on self-employment profit.

**SBP's 15% has nothing to do with your income-tax rate.**

## 2. Per monthly subscriber ($9.99)

| Step | Per month | Type |
|---|---|---|
| Customer price | USD 9.99 (+ local sales tax, collected by Apple) | FACT |
| Apple at 15% | −USD 1.50 → **USD 8.49** | FACT |
| In CAD (×1.4154) | **CAD 12.02** | ESTIMATE |
| After 3% refund allowance | **CAD 11.66** (FX range 11.37–11.86) | ESTIMATE |
| Business costs | about CAD 0.10–1.00 per subscriber per month at scale (mostly fixed; see §6) | ESTIMATE |
| **After income tax + CPP** | **20h/30h job: CAD 8.01 · 40h: CAD 7.09 · 50h: CAD 8.10** | ESTIMATE |

## 3. Per annual subscriber ($59.99)

| Step | Upfront, once a year | Type |
|---|---|---|
| Apple at 15% | **USD 50.99** | FACT |
| In CAD | **CAD 72.17**; after refunds **CAD 70.01** (range 68.26–71.22) | ESTIMATE |
| **After tax + CPP** | **20h/30h: CAD 48.11 · 40h: CAD 42.57 · 50h: CAD 48.66** | ESTIMATE |
| Monthly equivalent | **CAD 3.55–4.06 / month**, about **half** of a monthly subscriber | ESTIMATE |

An annual subscriber pays once and renews (or doesn't) **12 months later**. Count them once a year, not every month. Annual is better for cash up front and has lower churn. Monthly earns about twice as much per month **while** the person stays.

## 4. 15% vs 30%

| | Monthly (USD) | Annual (USD) | Extra you keep with SBP |
|---|---|---|---|
| 15% (SBP) | 8.49 | 50.99 | — |
| 30% (standard, first year) | 6.99 | 41.99 | **+USD 1.50/mo (≈ CAD 2.12)**, **+USD 9.00/yr (≈ CAD 12.74)** |

That's 21% more proceeds. Under the standard program a subscription drops to 15% anyway after its first paid year, but SBP gives you 15% from day one. **Enroll before launch.**

## 5. How your $34.50/hour job changes things

App profit is added **on top of** your wages, so it's taxed at your **marginal** rate (the rate on the next dollar), plus self-employed CPP until you hit the CPP maximums.

| Job | Wages | Marginal tax + CPP on the first app dollars | Why |
|---|---|---|---|
| 20 h/wk | $35,880 | **31.3%** | 14% fed + 8% AB + 11.9% CPP − CPP deduction/credit |
| 30 h/wk | $53,820 | **31.3%** | same brackets |
| 40 h/wk | $71,760 | **39.2%** → 36.1% → 30.5% | 30.5% brackets + CPP to $74,600, then CPP2 8% to $85,000, then no CPP |
| 50 h/wk | $89,700 | **30.5%** | CPP and CPP2 already maxed by the job; brackets only |

As app profit grows (40h job): marginal rate 39% → 36% → 30.5% (at about $15k–45k profit, after CPP maxes out) → 36% → 38% → 47% (above about $190k total income) → 48%. The **average** tax on app income stays around 33–39% up to $200k of profit. The 40h case is the worst one at small scale because every new dollar still attracts self-employed CPP.

**Marginal rate:** the rate on your next dollar. **Effective (average) rate:** total extra tax ÷ total app profit. Your employer withholds only for wages, so **nothing is withheld on app income**.

## 6. Scale (only monthly subscribers, all kept for 12 months, 40h job)

| Paying subs | Gross revenue | Apple 15% | Proceeds | Expenses | Tax + CPP | **After tax** | **Per sub per month** | Marginal |
|---|---|---|---|---|---|---|---|---|
| 100 | $16,968 | $2,469 | $13,990 | $1,174 | $4,710 | **$8,106** | **$6.75** | 36% |
| 500 | $84,839 | $12,344 | $69,950 | $3,347 | $22,217 | **$44,386** | **$7.40** | 36% |
| 1,000 | $169,678 | $24,688 | $139,900 | $4,637 | $48,944 | **$86,318** | **$7.19** | 42% |
| 2,000 | $339,356 | $49,376 | $279,799 | $7,834 | $110,810 | **$161,156** | **$6.71** | 47% |
| 5,000 | $848,391 | $123,441 | $699,498 | $14,198 | $308,928 | **$376,372** | **$6.27** | 48% |
| 10,000 | $1,696,782 | $246,882 | $1,398,996 | $22,682 | $640,615 | **$735,700** | **$6.13** | 48% |

All amounts are CAD per year (gross after the 3% refund allowance). Proceeds near 10,000 subscribers approach Apple's **USD 1M SBP limit**. Going over it means 30% on further sales and the following year. Churn, acquisition (ads) and one-time costs are **not** included here; see §9.

## 7. Sole proprietor vs corporation (illustrative, 40h job)

| App profit | Corp tax 11% | Kept in corp | Net to you if all paid out as dividends | Net as sole proprietor |
|---|---|---|---|---|
| $25,000 | $2,750 | $22,250 | ≈ $16,900 | ≈ $16,550 |
| $100,000 | $11,000 | $89,000 | ≈ $65,400 | ≈ $65,400 |
| $300,000 | $33,000 | $267,000 | ≈ $174,400 | ≈ $176,000 |

- **Corporate tax isn't your take-home.** Money left in the company is taxed at only 11% for now. Once you pay it out, you pay personal tax on it, and the total ends up about the same ("integration").
- The gain is **deferral** (money you leave in the company and reinvest), not a permanent saving.
- Dividends avoid CPP (and give no CPP pension). Salary from the company is deductible to it but brings CPP back.
- Costs: incorporation about $500–1,500, plus a corporate tax return and bookkeeping (about $2,000–4,000 a year).
- **At your stage it's not worth it.** Revisit once profit regularly goes beyond what you spend personally (roughly $60–100k a year you could leave in the company). **CPA:** salary/dividend mix, TOSI, association rules, the $500k limit, and transferring the app's IP.

## 8. GST/HST (separate from everything above)

- **Apple collects and remits** consumption tax on App Store sales to customers (in Canada as a distribution-platform operator since July 2021). Your proceeds are already after that tax.
- **You** are a **small supplier** until your worldwide taxable supplies pass **$30,000 in four consecutive quarters**. That's roughly **180–220 steady monthly subscribers**. After that you must register.
- Registered or not, sales you make **to Apple outside Canada** are often **zero-rated** exports, and you could claim back GST you paid on expenses. Apple may also charge GST on its commission. **CPA:** confirm who your supply is made to under Apple's agreement, zero-rating, and Apple's Canadian tax form (GST/HST number in App Store Connect).

## 9. Planning numbers for marketing

| Metric | Planning value | Type |
|---|---|---|
| Proceeds per monthly subscriber | CAD 11.66/mo | ESTIMATE |
| Monthly churn | 8–12% → average life 8–12 months | ASSUMPTION |
| Monthly subscriber lifetime value (pre-tax) | CAD 95–140 | ESTIMATE |
| Annual subscriber lifetime value (pre-tax, 35–45% renew) | CAD 105–125 | ESTIMATE |
| **Max cost to acquire one paying subscriber** | **≤ CAD 35–45** (about ⅓ of lifetime value) to stay healthy | ESTIMATE |

Ad spend is a deductible business expense, so judge acquisition cost against **pre-tax** lifetime value. Track installs → paywall views → purchases. With a hard paywall and no trial, expect roughly 2–6% of installs to buy (ASSUMPTION; measure your own).

## 10. Answers

1. **Kept per $9.99 monthly subscriber after Apple (15%):** USD 8.49 ≈ **CAD 12.02** (≈ CAD 11.66 after a refund allowance).
2. **After tax + CPP:** about **CAD 7.10–8.10 per month**. CAD 7.09 with a 40h job (the worst case at small scale); CAD 8.01 at 20–30h.
3. **Per $59.99 annual subscriber:** CAD 72.17 after Apple → about **CAD 42.60–48.70 per year** after tax.
4. **Your job's effect:** app profit is taxed at your marginal rate on top of wages. At 40h you're in the 30.5% bracket band **and** still paying CPP up to $74,600 (39% total). At 50h CPP is already maxed (30.5%).
5. **Higher brackets:** per-subscriber take-home falls from about $7.40 to about $6.10/month as yearly profit passes about $190k (47–48% marginal).
6. **Eligible for SBP?** Yes (new developer, under USD 1M). **But it's not automatic. Enroll.**
7. **Confirm 15% is active:** the enrollment approval email or the status in your developer account; then App Store Connect → Payments and Financial Reports should show proceeds of about 85% of the pre-tax price.
8. **Incorporate now?** No. Revisit at around $60–100k a year you could leave in the company.
9. **Tax reserve:** set aside **40% of app profit** (35% if your job is under about 30 h/wk; 45–50% once yearly profit passes about $150k). Expect CRA **instalments** once tax owing exceeds $3,000 in a year.
10. **Marketing:** plan with proceeds of CAD 11.66/mo and lifetime value of about CAD 100–120. Keep the cost to acquire a paying subscriber at or under CAD 35–45.

### Verification gaps (CPA / you)
- Alberta 2026 personal amount ($22,769) and credit rate (8%), and CPP2 figures, against CRA tables.
- SBP enrollment status.
- Your actual 2026 wages (hours, overtime, unpaid weeks).
- GST/HST registration timing and Apple's tax forms.
- Sole proprietor vs a registered trade name ("Gentlyreset").
