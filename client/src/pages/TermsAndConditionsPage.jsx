import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SEO from '../components/SEO';

const TermsAndConditionsPage = () => {
    const [expanded, setExpanded] = useState(null);

    const toggleSection = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const sections = [
        {
            id: 'introduction',
            title: '1. Agreement to Terms',
            content: `These Terms and Conditions ("Terms") constitute a legal agreement between you ("User," "you," or "your") and DaanSathi ("we," "us," "our," or "Company"). By accessing, browsing, and using the DaanSathi platform (website, mobile app, and all related services), you acknowledge that you have read, understood, and agree to be bound by these Terms.

If you do not agree to any part of these Terms, you may not use our Platform. Your continued use of the Platform following any changes to these Terms signifies your acceptance of those changes.`
        },
        {
            id: 'use-license',
            title: '2. Use License',
            content: `**2.1 Grant of License**
Subject to your compliance with these Terms, we grant you a limited, non-exclusive, revocable, non-transferable license to:
- Access and use the Platform for lawful purposes
- Make one machine-readable copy of Platform content for personal use only
- Participate in donations and support campaigns

**2.2 License Restrictions**
You may not:
- Modify, reproduce, or distribute any Platform content without permission
- Use the Platform for commercial purposes (except as a registered NGO)
- Attempt to gain unauthorized access to any portion of the Platform
- Interfere with Platform security or functionality
- Harass, abuse, or harm other users
- Upload viruses, malware, or harmful code
- Scrape, crawl, or automatically collect data
- Reverse-engineer or decompile any Platform code
- Use the Platform for illegal activities

**2.3 License Termination**
We may revoke your license and terminate your access at any time, with or without cause, and without notice or liability.`
        },
        {
            id: 'user-accounts',
            title: '3. User Accounts',
            content: `**3.1 Account Creation**
To access certain features, you may need to create an account by providing:
- Valid email address
- Secure password
- Accurate personal information
- Phone number (optional)

**3.2 Account Responsibility**
You are responsible for:
- Maintaining the confidentiality of your password
- All activities under your account
- Notifying us of unauthorized access
- Ensuring accuracy of your account information

**3.3 Account Suspension**
We may suspend or terminate your account if:
- You violate these Terms
- You engage in fraudulent or illegal activity
- Your account is inactive for 12 months
- We determine you are a duplicate account
- You violate our community guidelines

**3.4 Account Deletion**
You can delete your account at any time through account settings. Upon deletion:
- Your account will be deactivated
- Historical donation records will be retained for compliance
- Personal information will be anonymized per privacy policy`
        },
        {
            id: 'donations',
            title: '4. Donation Terms',
            content: `**4.1 Donation Process**
By making a donation through DaanSathi:
- You confirm you are 18 years or older (or have parental consent)
- You authorize the payment of the stated amount
- You acknowledge receipt of a donation receipt
- You understand the amount includes platform fees (typically 2%)

**4.2 Platform Fees**
- DaanSathi charges a platform fee to sustain operations
- Standard fee: 2% of donation amount
- Donors see fee breakdown before completing donation
- Fees are non-refundable

**4.3 Donation Eligibility**
- Donations must be at least ₹1
- Donations must be made through valid payment methods
- Fraudulent donations may be reversed
- We reserve the right to reject any donation

**4.4 Donation Irrevocability**
- Once completed, donations cannot be reversed
- Refunds are not available for completed donations
- Cancellations must be made before payment processing
- Exceptions apply only in cases of fraud or technical errors

**4.5 Anonymous Donations**
- You can choose to donate anonymously
- Anonymous donations won't display your name publicly
- Receipt and confirmation sent to provided email (if given)
- You still receive tax documentation

**4.6 Donation Allocation**
- Your donation goes to the selected campaign
- If campaign closes before reaching goal, funds may be redirected
- You'll be notified of any changes to fund allocation
- Tax benefits (if applicable) are your responsibility`
        },
        {
            id: 'campaigns',
            title: '5. Campaign Terms',
            content: `**5.1 Campaign Creators**
Campaign creators (NGOs, individuals) agree to:
- Provide accurate and truthful campaign information
- Use funds only for stated purposes
- Provide regular updates on campaign progress
- Comply with all applicable laws and regulations
- Not engage in misleading or fraudulent practices

**5.2 Campaign Verification**
- DaanSathi verifies NGO registration and credentials
- We reserve the right to reject campaigns that don't meet standards
- Verification is not endorsement of campaign effectiveness
- Creators are solely responsible for campaign outcomes

**5.3 Campaign Modifications**
- Campaigns may be updated with creator consent
- Major changes require notification to donors
- Campaigns may be suspended for violations
- Completed campaigns cannot be restarted

**5.4 Fund Transfer**
- Funds are transferred to campaign creators via designated methods
- Transfer timeline depends on campaign status and verification
- DaanSathi is not liable for fund misuse by creators
- Donors can report suspected misuse for investigation`
        },
        {
            id: 'payment',
            title: '6. Payment Terms',
            content: `**6.1 Payment Processing**
- Payments are processed through Razorpay (PCI-DSS compliant)
- We accept credit cards, debit cards, UPI, and net banking
- Payment authorization does not guarantee success
- You are solely responsible for payment security

**6.2 Payment Security**
- We use SSL/TLS encryption for all transactions
- Your payment information is not stored on our servers
- Razorpay handles all payment processing securely
- You are responsible for protecting your payment credentials

**6.3 Failed Payments**
- If payment fails, your account won't be charged
- You'll be notified of the failure reason
- You can retry payment or contact support
- Multiple failed attempts may be flagged as suspicious

**6.4 Refund Policy**
- Completed donations are generally non-refundable
- Refunds may be issued for:
  - Duplicate charges (within 7 days)
  - Technical errors by DaanSathi
  - Fraudulent transactions (after investigation)
  - Unauthorized payments
- Refund requests must be submitted within 30 days
- Processing takes 5-7 business days

**6.5 Currency and Taxes**
- All amounts are in Indian Rupees (₹)
- You are responsible for applicable taxes
- Tax receipts are provided for donations over specified amounts
- Tax benefits depend on your location and campaign status`
        },
        {
            id: 'user-conduct',
            title: '7. User Conduct and Prohibited Activities',
            content: `**7.1 Acceptable Use**
You agree to use the Platform only for lawful purposes and in ways that:
- Do not violate any applicable law or regulation
- Do not infringe on others' intellectual property rights
- Do not defame, harass, abuse, or threaten others
- Do not spam or send unsolicited communications
- Do not transmit viruses or harmful code
- Do not attempt unauthorized access

**7.2 Prohibited Content**
You will not:
- Upload illegal, obscene, or offensive content
- Share private information without consent
- Impersonate others or misrepresent identity
- Create multiple accounts to circumvent restrictions
- Manipulate donation systems or exploit vulnerabilities
- Engage in money laundering or financial crimes
- Create content promoting discrimination or violence

**7.3 Consequences of Violations**
We may:
- Remove prohibited content
- Suspend or terminate your account
- Report illegal activity to authorities
- Pursue legal action for damages
- Block your access indefinitely
- Cooperate with law enforcement`
        },
        {
            id: 'intellectual-property',
            title: '8. Intellectual Property Rights',
            content: `**8.1 Platform Content**
- All Platform content (text, graphics, logos, images) belongs to DaanSathi or licensors
- Content is protected by copyright, trademark, and other intellectual property laws
- Your license is limited to personal, non-commercial use

**8.2 User Content**
- You retain ownership of content you upload (photos, messages, testimonials)
- By uploading content, you grant DaanSathi a worldwide, royalty-free license to use it
- You warrant that you own or have permission to share all content
- DaanSathi may modify, reproduce, or redistribute your content

**8.3 Campaign Content**
- Campaign creators retain ownership of campaign materials
- DaanSathi may use campaign content for marketing and promotion
- Donors' testimonials and comments may be shared publicly
- Creators cannot modify content after campaign launch

**8.4 Third-Party Content**
- Third-party content is subject to respective licenses
- We are not liable for third-party intellectual property claims
- Report copyright violations to: legal@daansathi.com`
        },
        {
            id: 'disclaimer',
            title: '9. Disclaimer of Warranties',
            content: `**9.1 "As-Is" Basis**
The Platform is provided on an "AS-IS" and "AS-AVAILABLE" basis without warranties of any kind, express or implied. We disclaim all warranties including:
- Merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy or completeness of information
- Uninterrupted or error-free operation

**9.2 No Guarantees**
We do not guarantee:
- Platform uptime or availability
- Accuracy of campaign information
- Fund allocation or usage by creators
- Campaign success or fund-raising goals
- Protection from fraud or unauthorized transactions
- Specific results from donations

**9.3 Your Responsibility**
You are responsible for:
- Evaluating campaign legitimacy
- Verifying creator credentials
- Assessing campaign viability
- Understanding tax implications
- Protecting your account security
- Reviewing all information before donating

**9.4 No Professional Advice**
Platform content does not constitute:
- Financial advice
- Tax advice
- Legal advice
- Medical advice
- Professional consultation
Consult appropriate professionals before making decisions.`
        },
        {
            id: 'limitation-liability',
            title: '10. Limitation of Liability',
            content: `**10.1 Limitation**
To the fullest extent permitted by law, DaanSathi shall not be liable for:
- Indirect, incidental, special, consequential, or punitive damages
- Lost profits, revenue, data, or business opportunities
- Third-party claims or actions
- Unauthorized access to accounts
- Suspension or termination of service
- Errors or omissions in Platform content
- Losses resulting from campaign failure
- Misuse of funds by campaign creators

**10.2 Liability Cap**
Our total liability shall not exceed the greater of:
- Amounts you paid to DaanSathi in the past 12 months
- ₹1,000

**10.3 Exceptions**
Limitations do not apply to:
- Death or personal injury caused by our negligence
- Fraud or willful misconduct
- Violations of consumer protection laws
- Cases where limitation is prohibited by law

**10.4 Third-Party Claims**
We are not liable for:
- Third-party content or conduct
- Links to external websites
- Campaign creator conduct or fraud
- Payment processor errors
- Loss of funds due to user error`
        },
        {
            id: 'indemnification',
            title: '11. Indemnification',
            content: `**11.1 Your Indemnification**
You agree to indemnify and hold harmless DaanSathi, its officers, employees, and agents from:
- Claims, damages, or liabilities arising from your use of the Platform
- Your violation of these Terms
- Your violation of applicable laws or regulations
- Your infringement of third-party rights
- Your content or campaigns
- Disputes with other users
- Any claims related to your donations

**11.2 Defense**
You will pay for legal defense costs and damages arising from claims you are required to indemnify us for.

**11.3 Cooperation**
You will cooperate fully in the defense of any claim and not settle without our consent.`
        },
        {
            id: 'modifications',
            title: '12. Modifications and Termination',
            content: `**12.1 Platform Modifications**
We reserve the right to:
- Modify or discontinue the Platform at any time
- Change features, functionality, or pricing
- Update our policies and procedures
- Restrict certain activities or user access

**12.2 Changes to Terms**
We may update these Terms at any time. We will:
- Post updated Terms on this page
- Update the "Last Modified" date
- Continue your use constitutes acceptance of changes
- Major changes may trigger email notification

**12.3 Service Termination**
We may terminate service:
- At any time for any reason
- Without notice or liability
- With respect to your account if you violate Terms
- If required by law

**12.4 Upon Termination**
- Your rights are immediately revoked
- You must cease Platform use
- Your data may be deleted per privacy policy
- Donations remain non-refundable
- Certain provisions survive termination`
        },
        {
            id: 'governing-law',
            title: '13. Governing Law and Jurisdiction',
            content: `**13.1 Governing Law**
These Terms are governed by and construed in accordance with:
- The laws of India
- Applicable federal and state regulations
- Without regard to conflict of law principles

**13.2 Jurisdiction**
- Exclusive jurisdiction lies with courts in India
- You consent to jurisdiction of Indian courts
- You waive any objection to venue
- All disputes shall be subject to Indian law

**13.3 Dispute Resolution**
Before litigation:
- Attempt to resolve disputes through good faith negotiation
- Contact us at: support@daansathi.com
- Allow 30 days for response and resolution
- If unresolved, proceed to litigation

**13.4 Alternative Dispute Resolution**
- Either party may pursue arbitration
- Arbitration shall be conducted per Indian Arbitration Act
- Venue shall be in India
- Decision is binding and enforceable`
        },
        {
            id: 'contact',
            title: '14. Contact Information',
            content: `**14.1 Questions About Terms**
If you have questions about these Terms and Conditions, please contact us:

Email: support@daansathi.com
Mailing Address: DaanSathi, India
Response Time: We respond within 7 business days

**14.2 Legal Notices**
Send legal notices to:
Email: legal@daansathi.com
Response Time: We respond within 15 business days

**14.3 Complaint Resolution**
For complaints, contact our grievance officer:
Email: grievance@daansathi.com
Response Time: We respond within 48 hours`
        }
    ];

    return (
        <>
            <SEO
                title="Terms & Conditions"
                description="Read DaanSathi's Terms and Conditions for using our donation platform."
            />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white py-12 sm:py-16">
                    <div className="section-container">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms & Conditions</h1>
                        <p className="text-lg text-white/90">
                            Please review our Terms and Conditions before using DaanSathi.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="section-container section-padding">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-800 dark:text-red-300">
                                <strong>Important:</strong> These Terms and Conditions are binding. By using DaanSathi, you agree to all terms listed below.
                            </p>
                        </div>

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

                        {/* Bottom CTA */}
                        <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <h3 className="text-lg font-semibold mb-2">Questions About Our Terms?</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                If you have any concerns or questions about these Terms and Conditions, please reach out to us.
                            </p>
                            <a
                                href="/contact"
                                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsAndConditionsPage;
