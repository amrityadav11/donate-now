import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
    const [expanded, setExpanded] = useState(null);

    const toggleSection = (section) => {
        setExpanded(expanded === section ? null : section);
    };

    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            content: `DaanSathi ("we," "us," "our," or "Company") is committed to protecting your privacy and ensuring you have a positive experience on our website and mobile application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Platform").

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Platform. By accessing and using DaanSathi, you signify that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.`
        },
        {
            id: 'information-collection',
            title: '2. Information We Collect',
            content: `We collect information in various ways:

**2.1 Information You Provide Directly**
- Account registration information (name, email, phone number)
- Donation details (amount, campaign selected, payment information)
- Communication preferences and messages
- Profile information and preferences
- Contact form submissions
- Feedback and support requests

**2.2 Payment Information**
- Credit/debit card details (processed securely via Razorpay)
- Billing address and transaction history
- Payment status and receipts

**2.3 Information Collected Automatically**
- IP address and device identifiers
- Browser type and version
- Operating system
- Pages visited and time spent
- Referral source
- Location data (if permitted)
- Cookies and similar tracking technologies

**2.4 Information from Third Parties**
- Payment processors (Razorpay)
- Social media platforms (if you connect your account)
- Analytics services`
        },
        {
            id: 'use-of-information',
            title: '3. How We Use Your Information',
            content: `We use the information we collect for various purposes:

**3.1 Primary Uses**
- Processing donations and payments
- Sending donation receipts and confirmations
- Creating and maintaining your account
- Communicating with you about campaigns and platform updates
- Providing customer support and technical assistance
- Improving and personalizing your experience on our Platform
- Conducting research and analytics to enhance our services
- Preventing fraud and ensuring platform security

**3.2 Marketing and Communications**
- Sending newsletters with campaign updates (if opted-in)
- Notifying you about new campaigns matching your interests
- Promotional communications (only with your consent)
- Updates about our services and features

**3.3 Legal and Compliance**
- Complying with legal obligations and regulatory requirements
- Enforcing our Terms & Conditions
- Protecting our legal rights and preventing misuse
- Investigating and resolving disputes`
        },
        {
            id: 'information-sharing',
            title: '4. Information Sharing and Disclosure',
            content: `We may share your information in the following circumstances:

**4.1 With Service Providers**
- Payment processors and financial institutions
- Email service providers
- Analytics and data analysis providers
- Cloud hosting and storage providers
- Customer support platforms

**4.2 Legal Requirements**
- When required by law or regulation
- In response to legal process or government requests
- To protect our rights, privacy, safety, or property
- To prevent or investigate potential wrongdoing

**4.3 Business Transfers**
- In case of merger, acquisition, or bankruptcy
- Your information may be transferred as part of that transaction

**4.4 Campaigns and NGOs**
- Campaign organizers may receive anonymous aggregated donation statistics
- Non-anonymous donors' information shared only with their explicit consent

**4.5 With Your Consent**
- We will not share your personal information for purposes other than those listed above without your explicit consent

**4.6 Public Information**
- Donor names may be displayed publicly on campaigns (unless you choose anonymous donation)
- Testimonials and feedback may be shared publicly`
        },
        {
            id: 'data-security',
            title: '5. Data Security',
            content: `DaanSathi implements comprehensive security measures to protect your personal information:

**5.1 Security Measures**
- End-to-end SSL/TLS encryption for all data transmission
- Secure payment processing through PCI-DSS compliant Razorpay
- Industry-standard encryption for sensitive data at rest
- Regular security audits and vulnerability assessments
- Secure authentication using JWT tokens
- Protection against XSS and injection attacks
- Rate limiting to prevent brute force attacks

**5.2 Data Protection**
- Limited access to personal information by authorized personnel only
- Strict confidentiality agreements with all staff and service providers
- Regular security training for our team
- Incident response procedures for potential breaches

**5.3 Limitations**
- While we implement strong security measures, no method of transmission over the internet is 100% secure
- We cannot guarantee absolute security of your information
- You are responsible for maintaining the confidentiality of your password

**5.4 Data Breach Notification**
- In case of a data breach, we will notify affected users without unreasonable delay
- We will provide information about the nature of the breach and steps being taken`
        },
        {
            id: 'data-retention',
            title: '6. Data Retention',
            content: `**6.1 Retention Periods**
- Donation records: Retained for 7 years for tax and legal compliance purposes
- Account information: Retained as long as your account is active
- Payment information: Retained as per regulatory requirements (typically 7 years)
- Communication records: Retained for 2 years or as required by law
- Cookies and tracking data: Retained based on cookie type (typically 1-2 years)

**6.2 Data Deletion**
- You can request deletion of your account and associated data at any time
- We will delete your account within 30 days of verification
- Certain information may be retained if required by law or for legitimate business purposes
- Aggregated and anonymized data may be retained indefinitely

**6.3 Archival**
- We may retain archived copies for backup and legal purposes
- Archived data will not be used for any active purposes`
        },
        {
            id: 'cookies',
            title: '7. Cookies and Tracking Technologies',
            content: `**7.1 Cookies**
- We use cookies to enhance your experience on our Platform
- Cookies help us remember your preferences and track usage patterns
- You can control cookie settings through your browser

**7.2 Types of Cookies**
- Essential cookies: Required for platform functionality
- Analytics cookies: Help us understand how you use our Platform
- Preference cookies: Remember your settings and choices
- Marketing cookies: Used for targeted advertising (with consent)

**7.3 Tracking Technologies**
- Web beacons and pixel tags for analytics
- Local storage for performance optimization
- Session tokens for secure authentication

**7.4 Cookie Management**
- You can opt-out of non-essential cookies
- Disabling cookies may affect Platform functionality
- Third-party analytics tools may set their own cookies

**7.5 Third-Party Cookies**
- We use Google Analytics for usage statistics
- These services may collect information about your browsing habits
- You can opt-out through their respective opt-out mechanisms`
        },
        {
            id: 'your-rights',
            title: '8. Your Privacy Rights',
            content: `**8.1 Access to Your Data**
- You have the right to access your personal information
- Request data access by contacting us with your account details
- We will provide your data within 30 days

**8.2 Correction and Update**
- You can update your profile information anytime in your account settings
- Contact us for assistance with updating any information
- We will make corrections within 15 days

**8.3 Deletion (Right to be Forgotten)**
- You can request deletion of your account and personal data
- Submit a deletion request through our contact form
- We will delete your data within 30 days, except as required by law

**8.4 Data Portability**
- You can request a copy of your data in a portable format
- We will provide your data within 30 days
- Data will be in a commonly used, machine-readable format

**8.5 Opt-Out of Communications**
- Unsubscribe from marketing emails using the link in each email
- Update communication preferences in your account settings
- We will honor your preferences within 48 hours

**8.6 Non-Discrimination**
- We will not discriminate based on privacy rights exercise
- You will not be denied services for exercising privacy rights

**8.7 Regulatory Rights (GDPR, etc.)**
- If you're in the EU, you have rights under GDPR
- If you're in India, you have rights under relevant data protection laws
- Contact us to exercise these rights`
        },
        {
            id: 'children',
            title: '9. Children\'s Privacy',
            content: `**9.1 Age Restriction**
- DaanSathi is not intended for individuals under 18 years of age
- We do not knowingly collect information from minors
- Parents/guardians should supervise online activities

**9.2 Parental Consent**
- If we become aware that a minor has provided information, we will delete it
- Parents/guardians can contact us to report or request deletion
- We comply with COPPA and other child protection laws

**9.3 Minor Donations**
- Donations by minors require parental/guardian consent
- We recommend using parental-controlled payment methods
- Parents are responsible for monitoring their child's activities`
        },
        {
            id: 'international',
            title: '10. International Data Transfers',
            content: `**10.1 Data Transfer**
- Your information may be transferred to countries other than where you reside
- We ensure appropriate safeguards for international transfers
- We comply with GDPR, CCPA, and other privacy regulations

**10.2 Cross-Border Compliance**
- We implement Standard Contractual Clauses for EU-US transfers
- We comply with adequacy decisions and legal frameworks
- Your rights are protected regardless of data location

**10.3 Server Locations**
- Data may be stored on servers in different countries
- All transfers are encrypted and secure
- You consent to such transfers by using our Platform`
        },
        {
            id: 'third-party',
            title: '11. Third-Party Links and Services',
            content: `**11.1 External Links**
- Our Platform may contain links to third-party websites
- We are not responsible for third-party privacy practices
- Review their privacy policies before providing information

**11.2 Third-Party Integrations**
- We integrate with Razorpay for payments
- We use Google Analytics for traffic analysis
- Third parties may collect information per their policies

**11.3 Social Media**
- Sharing on social media is your choice
- Social media platforms have their own privacy policies
- We recommend reviewing third-party policies

**11.4 No Endorsement**
- Third-party links do not imply endorsement
- We are not liable for third-party content or practices`
        },
        {
            id: 'contact',
            title: '12. Contact Us',
            content: `**12.1 Privacy Questions**
If you have questions about this Privacy Policy or our privacy practices, please contact us:

Email: privacy@daansathi.com
Mailing Address: DaanSathi, India
Response Time: We respond to privacy inquiries within 7 business days

**12.2 Data Protection Officer**
If you have concerns about your data handling, contact our Privacy Officer at:
privacy@daansathi.com

**12.3 Regulatory Complaints**
If you believe your privacy rights have been violated, you can file a complaint with:
- Your local data protection authority (for GDPR)
- Your country's privacy/consumer protection agency`
        },
        {
            id: 'updates',
            title: '13. Policy Updates',
            content: `**13.1 Changes to This Policy**
- We may update this Privacy Policy from time to time
- Changes will be posted on this page with an updated "Last Updated" date
- Continued use of the Platform constitutes acceptance of changes

**13.2 Notification of Major Changes**
- For significant changes, we will notify you via email
- You may be required to accept the updated policy to continue using the Platform

**13.3 Your Responsibility**
- It is your responsibility to review this policy periodically
- Changes are effective immediately upon posting`
        }
    ];

    return (
        <>
            <SEO
                title="Privacy Policy"
                description="Learn about DaanSathi's privacy practices and how we protect your data."
            />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white py-8 sm:py-12">
                    <div className="section-container text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-lg text-white/90">
                            Your privacy is important to us. Learn how DaanSathi collects, uses, and protects your information.
                        </p>
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

                        {/* Bottom CTA */}
                        <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <h3 className="text-lg font-semibold mb-2">Questions About Privacy?</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                If you have any questions about how we handle your data, please don't hesitate to contact us.
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

export default PrivacyPolicyPage;
