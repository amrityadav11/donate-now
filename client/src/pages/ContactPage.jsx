import { useState } from 'react';
import { contactService } from '../services/contactService';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiHeadphones } from 'react-icons/fi';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
    });

    const contactCategories = [
        {
            id: 'general',
            name: 'General Inquiry',
            email: 'rajare353@gmail.com',
            description: 'General questions about DaanSathi'
        },
        {
            id: 'donation',
            name: 'Donation Issue',
            email: 'rajare353@gmail.com',
            description: 'Issues with donations or payments'
        },
        {
            id: 'refund',
            name: 'Refund Request',
            email: 'rajare353@gmail.com',
            description: 'Refund and payment disputes'
        },
        {
            id: 'ngo',
            name: 'NGO Partnership',
            email: 'rajare353@gmail.com',
            description: 'Create or manage campaigns'
        },
        {
            id: 'legal',
            name: 'Legal & Privacy',
            email: 'rajare353@gmail.com',
            description: 'Privacy, legal, or compliance issues'
        },
        {
            id: 'grievance',
            name: 'Grievance Officer',
            email: 'rajare353@gmail.com',
            description: 'Formal complaints and disputes'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'category') {
            setSelectedCategory(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const submitData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                category: selectedCategory
            };
            await contactService.submitContact(submitData);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                category: 'general',
            });
            setSelectedCategory('general');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const currentCategory = contactCategories.find(cat => cat.id === selectedCategory);

    return (
        <>
            <SEO
                title="Contact Us"
                description="Contact DaanSathi for support, donations help, NGO partnerships, legal inquiries, and more."
            />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-orange-500 text-white py-12 sm:py-16">
                    <div className="section-container text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-lg text-white/90">
                            We're here to help. Reach out with questions, feedback, or partnership inquiries.
                        </p>
                    </div>
                </div>

                {/* Quick Contact Categories */}
                <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="section-container section-padding">
                        <h2 className="text-2xl font-bold mb-8">Select Your Inquiry Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contactCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${selectedCategory === category.id
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
                                        }`}
                                >
                                    <h3 className="font-semibold mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                                    <p className="text-xs text-primary-600 mt-2">{category.email}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section-container section-padding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-primary-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {currentCategory ? currentCategory.name : 'Email'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {currentCategory ? currentCategory.email : 'rajare353@gmail.com'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Response within 24-48 hours
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiHeadphones className="text-primary-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Support Line</h3>
                                        <p className="text-gray-600 dark:text-gray-400">+91-8541-XXXX-XXX</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Available for inquiries
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="text-primary-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Office Address</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            DaanSathi<br />
                                            Samastipur, Bihar 848207<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FiClock className="text-primary-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Response Time</h3>
                                        <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                            <p><span className="text-gray-700 dark:text-gray-300">General:</span> 24-48 hours</p>
                                            <p><span className="text-gray-700 dark:text-gray-300">Urgent:</span> 12 hours</p>
                                            <p><span className="text-gray-700 dark:text-gray-300">Grievance:</span> 48 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Links */}
                            <div className="mt-8 card p-6">
                                <h3 className="font-semibold mb-4">Useful Resources</h3>
                                <div className="space-y-3 text-sm">
                                    <a href="/privacy" className="block text-primary-600 hover:text-primary-700">
                                        → Privacy Policy
                                    </a>
                                    <a href="/terms" className="block text-primary-600 hover:text-primary-700">
                                        → Terms & Conditions
                                    </a>
                                    <a href="/cancellation-refund" className="block text-primary-600 hover:text-primary-700">
                                        → Refund Policy
                                    </a>
                                    <a href="/pricing" className="block text-primary-600 hover:text-primary-700">
                                        → Pricing & Fees
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Inquiry Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={selectedCategory}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        {contactCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Your phone number (optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="What is this about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="input-field resize-none"
                                        placeholder="Please provide details about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner w-5 h-5 border-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                                We respect your privacy. Read our <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
