import SEO from '../components/SEO';

const TermsPage = () => {
    return (
        <>
            <SEO title="Terms & Conditions" description="Read our terms and conditions for using this donation platform." />

            <div className="section-container section-padding">
                <div className="max-w-3xl mx-auto">
                    <h1 className="heading-1 mb-2">Terms &amp; Conditions</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: June 2025</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            By accessing and using this website or making a donation, you accept and agree to
                            be bound by these Terms &amp; Conditions. If you do not agree, please do not use
                            our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">2. Donation Policy</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>All donations are voluntary and non-refundable once processed.</li>
                            <li>You must be at least 18 years old to make a donation, or have parental consent.</li>
                            <li>Donations are used exclusively for the stated campaign purposes.</li>
                            <li>We reserve the right to reallocate funds to similar causes if a campaign goal is met or cancelled.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">3. Payment Processing</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All payments are processed by Razorpay. By making a payment, you agree to
                            Razorpay's terms of service. We are not responsible for payment processing
                            failures or delays caused by your bank or payment provider.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">4. Campaign Accuracy</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We make every effort to ensure campaign information is accurate and up to date.
                            However, we cannot guarantee complete accuracy of all campaign details.
                            Donors are encouraged to contact us with any concerns before donating.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">5. Prohibited Use</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>Use the platform for fraudulent transactions</li>
                            <li>Attempt to reverse-engineer or disrupt our systems</li>
                            <li>Submit false or misleading contact information</li>
                            <li>Use automated scripts or bots to interact with the platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All content on this website including text, images, logos, and design elements
                            are owned by or licensed to us. You may not reproduce or distribute any content
                            without our written permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            To the maximum extent permitted by law, we are not liable for any indirect,
                            incidental, or consequential damages arising from your use of this platform
                            or inability to access it.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3">8. Changes to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We may update these Terms &amp; Conditions from time to time. Continued use of
                            the platform after changes constitutes acceptance of the new terms. We will
                            note the date of the last update at the top of this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">9. Governing Law</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            These terms are governed by the laws of India. Any disputes shall be resolved
                            under the jurisdiction of Indian courts.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default TermsPage;
