import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import SEO from '../components/SEO';

const CancellationRefundPage = () => {
    const [expanded, setExpanded] = useState(null);

    const toggleSection = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const sections = [
        {
            id: 'overview',
            title: '1. Policy Overview',
            content: `DaanSathi's Cancellation and Refund Policy is designed to be transparent and fair for all users. This policy outlines the circumstances under which donations may be cancelled, refunded, or reversed.

Please note: Donations are acts of charitable giving. Once completed, most donations are non-refundable. However, we do provide refunds in specific circumstances outlined in this policy.

This policy is effective immediately and applies to all donations made through the DaanSathi platform.`
        },
        {
            id: 'non-refundable',
            title: '2. Non-Refundable Donations',
            content: `**2.1 General Non-Refundable Rule**
As a general principle, all completed donations are non-refundable. By completing a donation, you:
- Acknowledge that the donation is final
- Understand that funds will be transferred to the campaign creator
- Accept that no refund will be issued once payment is successful
- Waive the right to reversal after payment confirmation

**2.2 Why Donations Are Non-Refundable**
- Donations support charitable causes and individuals in need
- Funds may be allocated to campaigns immediately
- Reversing donations after allocation causes operational difficulties
- Protecting donation integrity prevents fraud and abuse

**2.3 Exceptions**
Refunds are only provided in the following limited circumstances:
- Technical errors by DaanSathi
- Fraudulent or unauthorized transactions
- Duplicate charges
- Campaign misrepresentation or fraud
- System failures during transaction processing

**2.4 Your Responsibility**
Before donating, you should:
- Review campaign details carefully
- Verify the legitimacy of the campaign
- Confirm the amount and recipient
- Ensure you're donating voluntarily
- Understand that cancellation after payment is difficult`
        },
        {
            id: 'cancellation-before-payment',
            title: '3. Cancellation Before Payment',
            content: `**3.1 Cancellation Rights**
You have the right to cancel a donation at any time BEFORE completing payment. 

**3.2 How to Cancel Before Payment**
- Close the payment window without completing payment
- Do not authorize the transaction in your payment app
- Navigate away from the donation page
- Decline to enter payment credentials

**3.3 No Charges for Cancellation**
If you cancel before payment completion:
- Your account will not be charged
- No funds will be transferred
- No record of donation will be created
- You can attempt the donation again later

**3.4 Payment Authorization Cancellation**
If payment authorization has been initiated but not yet processed:
- Contact your bank or payment provider immediately
- Inform them of the unauthorized transaction
- DaanSathi can assist in the dispute process
- Resolution typically takes 5-7 business days

**3.5 Razorpay Payment Cancellation**
- Within the Razorpay payment page, you can abandon the transaction
- Closing the payment window cancels the authorization
- No charges will be applied if payment is not completed`
        },
        {
            id: 'refund-eligibility',
            title: '4. Refund Eligibility',
            content: `**4.1 Eligible Cases for Refund**

You may be eligible for a refund in the following scenarios:

**Duplicate Charges**
- Payment processed twice for the same donation
- Must be reported within 7 days
- Proof of duplicate charge required
- Refund issued within 5-7 business days

**Technical Errors**
- DaanSathi system error caused unauthorized charge
- Multiple charges due to platform malfunction
- Payment gateway error resulting in extra debits
- Server crash during transaction processing

**Fraudulent Transactions**
- Payment made without your authorization
- Account compromised or credentials stolen
- Identity theft or account takeover
- Unauthorized person made donation
- Investigation required (typically 30 days)

**Unauthorized Transactions**
- You did not initiate the donation
- Someone used your payment method without consent
- Your card information was used fraudulently
- Chargeback protection applies

**Campaign Misrepresentation**
- Campaign information was materially false
- Campaign creator committed fraud
- Funds used for unapproved purposes
- Campaign shutdown due to illegality
- Requires investigation and verification

**System Failures**
- Payment processed but no donation recorded
- Donation recorded but payment not received by campaign
- Platform crash during critical transaction step
- Timeout errors during payment processing

**4.2 Non-Eligible Cases**
Refunds will NOT be issued for:
- Change of mind after payment
- Campaign underperformance
- Dissatisfaction with campaign results
- Finding alternative campaign to support
- Financial hardship or personal circumstances
- Cancellation requests after 30 days
- Donations made in error by the donor`
        },
        {
            id: 'refund-process',
            title: '5. Refund Request Process',
            content: `**5.1 Initiate Refund Request**
To request a refund:

Step 1: Login to your DaanSathi account
Step 2: Navigate to "My Donations" or "Transaction History"
Step 3: Find the donation you want to refund
Step 4: Click "Request Refund" or "Report Issue"
Step 5: Select the reason for refund
Step 6: Provide detailed explanation and supporting documents
Step 7: Submit the refund request form

**5.2 Refund Request Form**
Include the following information:
- Transaction ID or Order ID
- Donation amount and date
- Campaign name or ID
- Reason for refund request
- Any supporting documentation
- Your preferred contact method
- Bank account details for refund (if eligible)

**5.3 Documentation Required**
Depending on reason, provide:

For duplicate charges:
- Screenshots of both transactions
- Bank statement showing duplicate charges
- Proof of payment

For technical errors:
- Screenshots of error messages
- Exact time of transaction
- Confirmation of issue from support

For fraudulent transactions:
- Police report (if filed)
- Bank dispute documentation
- Affidavit stating fraud
- Chargeback case number (if applicable)

For misrepresentation:
- Evidence of false claims
- Screenshots or documentation
- Communication with campaign creator
- Proof of fund misuse

**5.4 Submission Deadline**
- Refund requests must be submitted within 30 days of transaction
- Requests after 30 days may be rejected
- Exceptions considered for documented fraud or system errors
- Extended deadlines at our discretion`
        },
        {
            id: 'refund-timeline',
            title: '6. Refund Timeline and Processing',
            content: `**6.1 Review Period**
After submitting your refund request:
- Initial review: 2-3 business days
- We may request additional information
- You'll be notified of decision via email
- If approved, processing begins immediately

**6.2 Investigation Period**
For disputes requiring investigation:
- Fraud cases: Up to 30 days
- Technical error cases: Up to 15 days
- Misrepresentation cases: Up to 30 days
- We'll provide updates every 7-10 days

**6.3 Approval and Processing**
Once approved:
- Refund is initiated immediately
- You'll receive confirmation email with reference number
- Refund processed to original payment method
- Processing time: 5-7 business days
- May vary by bank or payment provider

**6.4 Refund Timeline Summary**
Day 1: Submit request
Days 2-3: Initial review
Days 4-15: Investigation (if needed)
Day 16+: Decision made
Days 17-23: Refund processed
Days 24-30: Funds appear in account

**6.5 Status Tracking**
- Login to your account to check refund status
- Email updates sent at key milestones
- Contact support for status inquiries
- Reference number provided for tracking`
        },
        {
            id: 'chargeback',
            title: '7. Chargeback and Dispute Process',
            content: `**7.1 Chargeback Rights**
If you believe your donation was unauthorized:
- You have the right to file a chargeback with your bank
- This is separate from DaanSathi refund process
- Chargeback is a protective mechanism for unauthorized charges
- Your bank will investigate and make a determination

**7.2 Chargeback Process**
1. Contact your bank or credit card company
2. Report the unauthorized transaction
3. Provide evidence of unauthorized charge
4. Your bank initiates investigation
5. DaanSathi receives chargeback notification
6. We will respond to your bank's inquiry
7. Decision made by bank after review

**7.3 Cooperation**
- DaanSathi will cooperate with chargeback investigations
- We will provide transaction records and documentation
- We may contact you to provide additional evidence
- Response typically within 15-30 days

**7.4 Simultaneous Claims**
- File either a refund request OR chargeback, not both
- Filing both may delay resolution
- We will investigate all claims in good faith
- Duplicate claims may be reported to authorities

**7.5 Outcome**
- Bank decision is final regarding chargebacks
- If chargeback is upheld, funds returned to your account
- If chargeback is denied, refund process continues
- Both parties will be notified of outcome`
        },
        {
            id: 'campaign-refunds',
            title: '8. Campaign-Specific Refunds',
            content: `**8.1 Campaign Closure**
If a campaign closes before reaching its goal:
- Donors are typically notified
- Campaign creator decides fund allocation
- Options may include: transfer to similar campaign, provide refunds, hold in escrow
- You'll be offered choices regarding your donation

**8.2 Campaign Fraud or Misuse**
If campaign creator is found guilty of fraud:
- DaanSathi will launch investigation
- All affected donors will be contacted
- Refunds issued from recovered funds (if available)
- If insufficient funds, funds returned proportionally
- Process may take 30-60 days

**8.3 Campaign Deletion or Suspension**
If campaign is deleted or suspended:
- Reason will be communicated to donors
- Refunds offered to affected donors
- Processing follows standard refund timeline
- You have 30 days to claim refund

**8.4 NGO Withdrawal**
If campaign creator (NGO) withdraws funds prematurely:
- DaanSathi investigates circumstances
- If violation occurred, refunds may be issued
- Donors notified of refund eligibility
- Claims must be submitted within 60 days

**8.5 Campaign Milestones Not Met**
- Simply not reaching fundraising goal does NOT qualify for refund
- Campaigns that underperform are not refundable
- Donors accept campaign risk when donating
- Exceptions only for documented misuse`
        },
        {
            id: 'special-cases',
            title: '9. Special Cases and Exceptions',
            content: `**9.1 Death or Incapacity**
In case of donor death or legal incapacity:
- Authorized representative can request refund
- Death certificate or legal documentation required
- Refund eligibility reviewed on case-by-case basis
- Family may request cancellation of recurring donations

**9.2 Donation Made in Error**
If you accidentally donated instead of viewing campaign:
- Request must be made within 24 hours
- Provide evidence of error
- Likelihood of approval depends on circumstances
- Generally non-refundable after 24 hours

**9.3 Under 18 Donation**
If minor made donation without parental consent:
- Parent/guardian can request cancellation
- Legal documentation of guardianship required
- Refund likely to be approved
- Account may be restricted for underage users

**9.4 Unauthorized Caregiver Donation**
If someone without power of attorney donated your funds:
- Report as fraudulent transaction
- Provide legal documentation
- Investigation initiated
- Refund likely if unauthorized status proven

**9.5 Extreme Hardship**
In cases of demonstrated extreme financial hardship:
- Special appeal process available
- Requires documentation (medical bills, job loss, etc.)
- Approved on case-by-case basis
- Not guaranteed but considered with empathy`
        },
        {
            id: 'contact-support',
            title: '10. Contact Support',
            content: `**10.1 Refund Support**
For refund-related inquiries:

Email: refunds@daansathi.com
Phone: +91-XXXX-XXXX-XXX (Coming Soon)
Website: www.daansathi.com/support
Hours: Monday-Friday, 10 AM - 6 PM IST
Response Time: 24-48 hours

**10.2 Required Information**
When contacting support about refunds, provide:
- Your email address or account ID
- Transaction ID (Order ID)
- Date of donation
- Amount donated
- Campaign name or ID
- Brief explanation of refund request
- Supporting documentation (if applicable)

**10.3 Escalation Process**
If unsatisfied with initial response:
- Request escalation to supervisor
- Provide additional documentation
- Case reviewed by senior team member
- Response within 7 business days
- Final appeal available if needed

**10.4 Complaint Resolution**
For unresolved disputes:
Email: grievance@daansathi.com
A grievance officer will respond within 48 hours

**10.5 Legal Recourse**
If informal resolution fails:
- Small Claims Court option available
- Arbitration process per Terms & Conditions
- Jurisdiction: India
- Governed by Indian law`
        },
        {
            id: 'faq',
            title: '11. Frequently Asked Questions',
            content: `**Q: Can I get a refund if I change my mind?**
A: No, donations are final once completed. Refunds only in the specific cases listed in this policy.

**Q: How long do I have to request a refund?**
A: You have 30 days from the transaction date to request a refund for eligible cases.

**Q: Will I get a refund if the campaign doesn't reach its goal?**
A: No, not reaching the goal does not qualify for refund. The campaign creator decides fund allocation.

**Q: Can I cancel before paying?**
A: Yes, you can cancel anytime before completing payment without any charges.

**Q: What if I donate twice by accident?**
A: Contact us immediately with proof. Duplicate charges can be refunded within 7 days.

**Q: How do I report a fraudulent donation?**
A: Contact refunds@daansathi.com with evidence of fraud. We'll investigate within 30 days.

**Q: Can I dispute a donation?**
A: Yes, through either DaanSathi refund process or through your bank's chargeback process.

**Q: What if I donated anonymously?**
A: Anonymous donations follow the same refund policy. Provide order ID and email address used.

**Q: Can I redirect my donation to another campaign?**
A: No, but you can request a refund for eligible cases and donate to another campaign.

**Q: How do I check my refund status?**
A: Login to your account and visit "My Donations" or email refunds@daansathi.com with your reference number.`
        }
    ];

    return (
        <>
            <SEO
                title="Cancellation & Refund Policy"
                description="Understand DaanSathi's refund and cancellation policies for donations."
            />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white py-8 sm:py-12">
                    <div className="section-container text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Cancellation & Refund Policy</h1>
                        <p className="text-lg text-white/90">
                            Understand our transparent refund policy and when refunds are available.
                        </p>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="section-container section-padding">
                        <h2 className="text-2xl font-bold mb-6">Quick Reference</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <FiCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-green-900 dark:text-green-300">Refundable Cases</p>
                                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">Fraud, duplicate charges, technical errors, misrepresentation</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-red-900 dark:text-red-300">Non-Refundable Cases</p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">Change of mind, campaign underperformance, personal circumstances</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
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
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                                            {section.title}
                                        </h2>
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
                            <h3 className="text-lg font-semibold mb-2">Need to Request a Refund?</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Have a refund-related question or need to submit a refund request? Contact our support team.
                            </p>
                            <a
                                href="/contact"
                                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CancellationRefundPage;
