import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import DonationReceiptPage from './pages/DonationReceiptPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminCampaignForm from './pages/admin/AdminCampaignForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDonations from './pages/admin/AdminDonations';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminContacts from './pages/admin/AdminContacts';
import AdminProfile from './pages/admin/AdminProfile';
import AdminManagement from './pages/admin/AdminManagement';
import AdminCampaignRequests from './pages/admin/AdminCampaignRequests';
import StartCampaignPage from './pages/StartCampaignPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    // Check for dark mode preference
    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/:slug" element={<CampaignDetailPage />} />
                <Route path="categories/:slug" element={<CategoryPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="donate/:id" element={<DonatePage />} />
                <Route path="payment/success" element={<PaymentSuccessPage />} />
                <Route path="payment/failed" element={<PaymentFailedPage />} />
                <Route path="donations/:id/receipt" element={<DonationReceiptPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
            </Route>

            {/* Start Campaign — standalone full page */}
            <Route path="/start-campaign" element={<StartCampaignPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="campaigns" element={<AdminCampaigns />} />
                <Route path="campaigns/new" element={<AdminCampaignForm />} />
                <Route path="campaigns/edit/:id" element={<AdminCampaignForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="donations" element={<AdminDonations />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="campaign-requests" element={<AdminCampaignRequests />} />
                <Route path="admins" element={<AdminManagement />} />
                <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
