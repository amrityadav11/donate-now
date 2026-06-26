import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
    return (
        <>
            <SEO title="Privacy Policy" description="Our privacy policy explains how we collect and use your information." />

            <div className="section-container section-padding">
                <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
                    <h1 className="heading-1 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: June 2025</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We are committed to protecting your personal information. This Privacy Policy explains
                            what information we collect when you visit our website or make a donation, how we use it,
                            and what rights you have regarding your data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            When you make a donation, we may collect:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Your name (optional — you may donate anonymously)</li>
                            <li>Email address (optional — for receipt delivery)</li>
                            <li>Phone number (optional)</li>
                            <li>Payment information (processed securely by Razorpay — we do not store card details)</li>
                            <li>Transaction identifiers for record keeping</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>To process your donation and send a receipt</li>
                            <li>To keep accurate records of charitable contributions</li>
                            <li>To communicate updates about the campaigns you supported (if email provided)</li>
                            <li>To improve our website and donation experience</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">4. Payment Security</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All payments are processed through Razorpay, a PCI-DSS compliant payment gateway.
                            We never store your credit card, debit card, or UPI credentials on our servers.
                            Your financial information is encrypted and handled entirely by Razorpay's secure systems.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">5. Anonymous Donations</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            You may choose to donate anonymously. In this case, your name will not be displayed
                            publicly or stored against your donation record. Only the transaction amount and ID
                            are recorded for accounting purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">6. Data Sharing</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties.
                            We may share data with service providers (such as Razorpay and email service providers)
                            solely to operate our website and process donations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">7. Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We use minimal cookies to remember your dark mode preference and maintain session state.
                            We do not use third-party advertising cookies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">8. Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            You have the right to request access to, correction of, or deletion of your personal data.
                            To exercise these rights, please contact us using the information on our Contact page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">9. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you have any questions about this Privacy Policy, please reach out via our{' '}
                            <a href="/contact" className="text-primary-600 hover:underline">Contact page</a>.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
