import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiInfo } from 'react-icons/fi';
import SEO from '../components/SEO';

const PricingDonationDetailsPage = () => {
    const [expanded, setExpanded] = useState(null);

    const toggleSection = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const donationTiers = [
        {
            name: 'Small Gift',
            amount: '₹100',
            description: 'A thoughtful contribution to any cause',
            benefits: ['Donation receipt', 'Campaign updates', 'Tax documentation']
        },
        {
            name: 'Regular Donation',
            amount: '₹500',
            description: 'Make a meaningful impact',
            benefits: ['All small gift benefits', 'Special donor badge', 'Monthly impact report']
        },
        {
            name: 'Major Contribution',
            amount: '₹2,500+',
            description: 'Be a significant change-maker',
            benefits: ['All regular benefits', 'Personal impact letter', 'Direct campaign updates', 'Name recognition (optional)']
        },
        {
            name: 'Monthly Support',
            amount: 'Recurring',
            description: 'Consistent support for ongoing causes',
            benefits: ['All donation benefits', 'Priority support', 'Quarterly impact reports', 'Early access to new campaigns']
        }
    ];

    const feeBreakdown = [
        {
            donation: '₹100',
            daanSathiFee: '₹2 (2%)',
            youDonate: '₹98',
            paymentFee: '₹2-3'
        },
        {
            donation: '₹500',
            daanSathiFee: '₹10 (2%)',
            youDonate: '₹490',
            paymentFee: '₹5-7'
        },
        {
            donation: '₹1,000',
            daanSathiFee: '₹20 (2%)',
            youDonate: '₹980',
            paymentFee: '₹10-15'
        },
        {
            donation: '₹5,000',
            daanSathiFee: '₹100 (2%)',
            youDonate: '₹4,900',
            paymentFee: '₹20-30'
        }
    ];

    const sections = [
        {
            id: 'platform-fee',
            title: '1. Platform Fees Explained',
            content: `**1.1 What is a Platform Fee?**
DaanSathi charges a 2% platform fee on all donations. This fee covers:
- Server and hosting costs
- Payment processing infrastructure
- Security and fraud prevention
- Customer support and assistance
- Platform maintenance and updates
- NGO verification and vetting
- Campaign moderation and oversight
- Technology development and improvements

**1.2 Standard Fee Structure**
- Standard platform fee: 2% of donation amount
- No hidden charges or surprise fees
- Fees are transparent at checkout
- You see exact breakdown before confirming

**1.3 Fee Examples**
- ₹100 donation → ₹2 fee
- ₹500 donation → ₹10 fee
- ₹1,000 donation → ₹20 fee
- ₹5,000 donation → ₹100 fee

**1.4 Fee Transparency**
When you donate, you'll see:
- Campaign name and cause
- Your donation amount
- Exact platform fee (2%)
- Estimated payment processing fee
- Total amount that will be charged
- Amount reaching the campaign

**1.5 Why We Charge Fees**
Unlike volunteer-run platforms, DaanSathi invests in:
- Professional operations and staff
- Advanced security measures
- NGO verification process
- Fraud detection and prevention
- Reliable payment infrastructure
- 24/7 customer support
- Continuous platform improvements`
        },
        {
            id: 'payment-fees',
            title: '2. Payment Processing Fees',
            content: `**2.1 Payment Gateway Fees**
In addition to our platform fee, Razorpay (our payment processor) charges:
- Card payments: 2-3% + ₹5 per transaction
- UPI payments: 1.1% + GST
- Net banking: 0.5% + GST
- Wallet payments: Varies by provider

**2.2 Total Cost Examples**
For a ₹100 donation:
- Your donation: ₹100
- DaanSathi fee (2%): ₹2
- Payment processing: ₹2-3
- Total charged to you: ₹104-105
- Campaign receives: ₹98

For a ₹1,000 donation:
- Your donation: ₹1,000
- DaanSathi fee (2%): ₹20
- Payment processing: ₹10-15
- Total charged to you: ₹1,030-1,035
- Campaign receives: ₹980

**2.3 Best Payment Methods**
By cost to you:
1. **UPI** - Lowest fees (~1.1%)
2. **Net Banking** - Moderate fees (~0.5%)
3. **Credit/Debit Card** - Higher fees (~2-3%)
4. **Wallet** - Variable fees

**2.4 No Surcharges**
We do NOT charge surcharges for:
- Using different payment methods
- International donations (where available)
- Large donations
- Recurring donations
- Unsuccessful payment attempts

**2.5 Fee Waiver Programs**
Special fee waivers may apply for:
- NGO campaigns (reduced from 2% to 1%)
- Disaster relief campaigns (reduced from 2% to 0.5%)
- Student/youth programs (reduced from 2% to 1%)
- Bulk donations from organizations
Contact us for eligibility`
        },
        {
            id: 'donation-amounts',
            title: '3. Donation Amounts',
            content: `**3.1 Minimum Donation**
- Minimum amount: ₹1
- No maximum limit
- Can donate any amount in between

**3.2 Flexible Amounts**
You can donate:
- Round amounts: ₹100, ₹500, ₹1,000
- Custom amounts: ₹237, ₹843, ₹1,567
- Any amount up to ₹1,00,00,000 (₹1 crore)

**3.3 Maximum Donation**
Current limits:
- Single donation: Up to ₹1,00,00,000
- Daily limit: Contact support for higher amounts
- Monthly recurring: Customizable

**3.4 Multiple Donations**
You can:
- Donate to multiple campaigns
- Make multiple donations to same campaign
- Set up monthly recurring donations
- Create custom donation sequences

**3.5 Suggested Donation Amounts**
Popular tiers:
- ₹50 - Small support
- ₹100 - Regular contribution
- ₹250 - Meaningful gift
- ₹500 - Significant contribution
- ₹1,000 - Major support
- ₹2,500+ - Major donor level
- Custom - Your choice

**3.6 Donation Policies**
- Minimum ₹1 per donation
- Must be positive whole number
- Decimal amounts not accepted
- Platform fee applies to all amounts
- No refunds for change of mind`
        },
        {
            id: 'tax-benefits',
            title: '4. Tax Benefits and Documentation',
            content: `**4.1 Tax Deductibility**
Donations to eligible campaigns may be tax-deductible:
- 80G certificate campaigns (80% deduction)
- 80GG certificate campaigns (additional deductions)
- CSR-certified campaigns (corporate deductions)
- Not all campaigns qualify for tax benefits

**4.2 Eligibility**
Your donation is tax-deductible if:
- Campaign creator has valid 80G certificate
- You're a registered taxpayer (PAN required)
- Donation amount is documented
- You request tax documentation from DaanSathi

**4.3 Tax Documentation**
We provide:
- Donation receipt (immediately after payment)
- Tax certificate (if campaign is 80G eligible)
- Annual summary (if requested)
- Proof of payment for tax filings

**4.4 How to Get Tax Certificate**
1. Login to your DaanSathi account
2. Go to "My Donations"
3. Select donation to 80G-eligible campaign
4. Click "Download Tax Certificate"
5. Certificate sent to your email

**4.5 Tax Filing**
When filing taxes:
- Include donation receipts and certificates
- Maintain records for 7 years
- Claim deduction under applicable section
- Consult tax advisor for guidance
- We provide all necessary documentation

**4.6 GST Compliance**
- DaanSathi is GST registered
- GST applicable on platform fees
- GST not applicable on donation amount
- GST invoice available if requested
- No GST for donations (tax-exempt transaction)

**4.7 PAN Requirement**
For donations over certain amounts:
- PAN may be required for compliance
- Help us verify your tax status
- Protects both donor and recipient
- Ensures tax transparency

**4.8 International Donors**
- NRI donations allowed (with PAN/TIN)
- Tax treatment per your country laws
- We provide documentation for filing
- Consult international tax advisor`
        },
        {
            id: 'payment-methods',
            title: '5. Payment Methods Accepted',
            content: `**5.1 Credit/Debit Cards**
Accepted:
- Visa, Mastercard, American Express
- Domestic and international cards
- Contactless/chip cards supported
- Digital card wallets (Apple Pay, Google Pay)

Security:
- PCI-DSS Level 1 compliant
- 3D Secure authentication
- EMI options available (select banks)
- Fraud protection included

**5.2 UPI (Unified Payments Interface)**
- Direct bank transfer via UPI
- Supported on all major apps
- Real-time settlement
- Lower processing fees
- Works with all Indian banks

**5.3 Net Banking**
- Direct bank transfer
- Supported banks: 50+ major banks
- Secure banking portal
- Instant confirmation
- Lower transaction fees

**5.4 Digital Wallets**
Supported wallets:
- Apple Pay
- Google Pay
- Samsung Pay
- PayTM
- PhonePe
- Amazon Pay

**5.5 Recurring Donations**
Set up monthly donations:
- Automatically charged each month
- Cancel anytime
- Payment method saved securely
- Confirmation email each month
- Easy to modify amount

**5.6 Corporate Donations**
For businesses:
- Invoice payment options
- Bank transfer for large amounts
- GST compliance support
- CSR documentation provided
- Custom donation solutions

**5.7 International Payments**
- Currently USD, EUR, GBP supported
- Conversion rates updated real-time
- International fees apply
- Limited to specific campaigns
- Subject to local regulations

**5.8 Payment Security**
- End-to-end encryption
- Secure payment gateway (Razorpay)
- No payment data stored on our servers
- Regular security audits
- Fraud detection systems
- Chargeback protection`
        },
        {
            id: 'receipt-tracking',
            title: '6. Receipts and Tracking',
            content: `**6.1 Donation Receipt**
Immediate receipt includes:
- Transaction ID and order number
- Donation amount
- Platform fee breakdown
- Amount reaching campaign
- Donor information (if not anonymous)
- Campaign details
- Timestamp and payment method
- Download/share options

**6.2 Receipt Delivery**
You receive receipt:
- Instant SMS (if phone provided)
- Email receipt (to registered email)
- Download from account dashboard
- Print or digital sharing options
- Multilingual receipts available

**6.3 Anonymous Donations**
- Donor name not displayed publicly
- Receipt sent to email if provided
- Tax documentation available
- Tracking via transaction ID
- Privacy maintained throughout

**6.4 Transaction Tracking**
Track your donations:
- Login to DaanSathi account
- View "My Donations" section
- See donation amount and date
- Track campaign impact
- View tax documents
- Download receipts anytime

**6.5 Campaign Tracking**
Follow campaign progress:
- Campaign updates and milestones
- Real-time fundraising progress
- Beneficiary stories and impact
- Creator updates and reports
- Fund utilization transparency
- Periodic impact reports

**6.6 Email Confirmations**
Automatic emails sent for:
- Donation confirmation (immediately)
- Tax certificate (if eligible, within 2 days)
- Campaign updates (if subscribed)
- Monthly summaries (optional)
- Year-end reports (optional)

**6.7 Download Options**
Download your records:
- PDF receipt
- Tax certificate (PDF)
- Annual summary report
- Campaign impact reports
- Export donation history

**6.8 Lost Receipt**
If you lose your receipt:
- Login and download from dashboard
- Request via support email
- Provide transaction ID
- Receipt resent within 24 hours
- Multiple downloads available`
        },
        {
            id: 'refund-info',
            title: '7. Refund Information',
            content: `**7.1 General Refund Policy**
- Donations are generally non-refundable
- Exceptions available for specific cases
- Refer to Cancellation & Refund Policy

**7.2 Refundable Cases**
Refunds available for:
- Duplicate charges
- Technical errors
- Fraudulent transactions
- Unauthorized payments
- Campaign misrepresentation

**7.3 Non-Refundable Cases**
Refunds NOT available for:
- Change of mind
- Campaign underperformance
- Personal circumstances
- Dissatisfaction with results

**7.4 Refund Timeline**
- Request submission: 30 days from donation
- Review period: 2-3 days
- Investigation: Up to 30 days if needed
- Processing: 5-7 days after approval
- Total timeline: 2-45 days typical

**7.5 Request Refund**
To request refund:
1. Login to account
2. Navigate to "My Donations"
3. Click "Request Refund"
4. Select reason
5. Provide explanation
6. Submit documentation
7. Await decision (email notification)

**7.6 Contact for Refunds**
Email: refunds@daansathi.com
Response: Within 24-48 hours
Reference: Provide transaction ID
Details: Include donation amount and date`
        },
        {
            id: 'faq',
            title: '8. Frequently Asked Questions',
            content: `**Q: Why does DaanSathi charge 2%?**
A: The fee covers server costs, security, NGO verification, customer support, and platform development to ensure a safe, reliable donation platform.

**Q: Is the fee separate from payment processing?**
A: Yes, DaanSathi charges 2%, and payment processor (Razorpay) charges additional fees based on payment method.

**Q: Can I donate without paying fees?**
A: No, fees are mandatory and go toward platform operations. However, we keep fees transparent and reasonable.

**Q: What's the cheapest way to donate?**
A: UPI has the lowest payment processing fees (~1.1%), so UPI donations have lowest total costs.

**Q: Do I get a tax receipt?**
A: Yes, if the campaign has 80G certification. You can download the tax certificate from your account.

**Q: Is my donation tax-deductible?**
A: Only if the campaign has a valid 80G certificate and you're an Indian taxpayer with PAN.

**Q: Can I claim donation in my taxes?**
A: Yes, if campaign is 80G-eligible. Include the tax certificate with your tax filing. Consult a tax advisor.

**Q: What if I donate and then change my mind?**
A: Refunds are not available for change of mind. Review campaign details carefully before donating.

**Q: Can I see where my donation goes?**
A: Yes, login to your account and track the campaign. You'll receive updates on fund utilization.

**Q: How do I get my receipt?**
A: Receipt sent immediately via email and SMS. You can also download it from your account dashboard anytime.

**Q: Can I set up monthly donations?**
A: Yes, setup recurring donations by selecting "Monthly" at checkout. Cancel anytime from your account.

**Q: What's the maximum I can donate?**
A: Up to ₹1,00,00,000 per single donation. Contact support for higher limits.

**Q: Are international donations possible?**
A: Limited availability. Check if your selected campaign accepts international donations (currency conversion applies).

**Q: How secure is my payment information?**
A: Fully secure with SSL encryption, PCI-DSS compliance, and no storage of card data on our servers.

**Q: What if my payment fails?**
A: You won't be charged. Try again with a different payment method or contact support.

**Q: Can I donate anonymously?**
A: Yes, select "Anonymous Donation" at checkout. Your name won't display publicly, but receipt sent to your email.

**Q: How quickly does the campaign creator receive my donation?**
A: After verification and campaign completion (or as campaign updates), funds transferred to campaign creator's account.`
        }
    ];

    return (
        <>
            <SEO
                title="Pricing & Donation Details"
                description="Learn about DaanSathi's transparent fee structure, donation amounts, tax benefits, and payment methods."
            />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white py-12 sm:py-16">
                    <div className="section-container text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Pricing & Donation Details</h1>
                        <p className="text-lg text-white/90">
                            Transparent fees, flexible amounts, and tax benefits for your donations.
                        </p>
                    </div>
                </div>

                {/* Donation Tiers */}
                <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="section-container section-padding">
                        <h2 className="text-2xl font-bold mb-8">Popular Donation Tiers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {donationTiers.map((tier, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                                    <p className="text-3xl font-bold text-primary-600 mb-2">{tier.amount}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tier.description}</p>
                                    <ul className="space-y-2">
                                        {tier.benefits.map((benefit, bidx) => (
                                            <li key={bidx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <FiCheck className="text-green-600 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fee Breakdown Table */}
                <div className="section-container section-padding">
                    <h2 className="text-2xl font-bold mb-6">Fee Breakdown Examples</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left font-semibold">Your Donation</th>
                                    <th className="px-4 py-3 text-left font-semibold">DaanSathi Fee (2%)</th>
                                    <th className="px-4 py-3 text-left font-semibold">Payment Fee</th>
                                    <th className="px-4 py-3 text-left font-semibold">Total You Pay</th>
                                    <th className="px-4 py-3 text-left font-semibold">Campaign Gets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeBreakdown.map((row, idx) => (
                                    <tr key={idx} className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 font-semibold text-primary-600">{row.donation}</td>
                                        <td className="px-4 py-3">{row.daanSathiFee}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.paymentFee}</td>
                                        <td className="px-4 py-3 font-semibold">{row.donation}</td>
                                        <td className="px-4 py-3 font-semibold text-green-600">{row.youDonate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                        <FiInfo className="inline mr-1" /> Payment fees vary based on payment method (UPI, Card, Net Banking, etc.)
                    </p>
                </div>

                {/* Main Content */}
                <div className="section-container section-padding">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Last Updated:</strong> January 2025
                            </p>
                        </div>

                        <div className="space-y-3">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                                            {section.title}
                                        </h3>
                                        {expanded === section.id ? (
                                            <FiChevronUp className="flex-shrink-0" />
                                        ) : (
                                            <FiChevronDown className="flex-shrink-0" />
                                        )}
                                    </button>

                                    {expanded === section.id && (
                                        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {section.content}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <h3 className="text-lg font-semibold mb-2">Ready to Make an Impact?</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Browse campaigns and start donating today. Your contribution, no matter the size, makes a real difference.
                            </p>
                            <a
                                href="/campaigns"
                                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Browse Campaigns
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingDonationDetailsPage;
