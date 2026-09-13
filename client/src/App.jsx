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
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import CancellationRefundPage from './pages/CancellationRefundPage';
import PricingDonationDetailsPage from './pages/PricingDonationDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import StartCampaignPage from './pages/StartCampaignPage';
import UserProfilePage from './pages/UserProfilePage';

// ─── NEW Item Donation Pages ───────────────────────────────────────────────
import ItemCampaignsPage from './pages/ItemCampaignsPage';
import ItemCampaignDetailPage from './pages/ItemCampaignDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ProductCatalogPage from './pages/ProductCatalogPage';

// ─── Admin Pages ───────────────────────────────────────────────────────────
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
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminItemCampaigns from './pages/admin/AdminItemCampaigns';
import AdminOrders from './pages/admin/AdminOrders';

// ─── NGO Pages ─────────────────────────────────────────────────────────────
import NGODashboard from './pages/ngo/NGODashboard';
import NGOCampaigns from './pages/ngo/NGOCampaigns';
import NGOCreateCampaign from './pages/ngo/NGOCreateCampaign';
import NGOOrders from './pages/ngo/NGOOrders';

// Layouts & Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import NGOLayout from './layouts/NGOLayout';
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
                <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="cancellation-refund" element={<CancellationRefundPage />} />
                <Route path="pricing" element={<PricingDonationDetailsPage />} />

                {/* ─── Item Donation Routes ─── */}
                <Route path="item-campaigns" element={<ItemCampaignsPage />} />
                <Route path="item-campaigns/:slug" element={<ItemCampaignDetailPage />} />
                <Route path="products" element={<ProductCatalogPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
                <Route path="track-order/:orderId" element={<TrackOrderPage />} />
            </Route>

            {/* Start Campaign — standalone full page */}
            <Route path="/start-campaign" element={<StartCampaignPage />} />

            {/* User Profile */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/profile/saved" element={<UserProfilePage />} />

            {/* ─── NGO Routes — uses NGOLayout + user auth ─── */}
            <Route
                path="/ngo"
                element={
                    <UserProtectedRoute>
                        <NGOLayout />
                    </UserProtectedRoute>
                }
            >
                <Route index element={<NGODashboard />} />
                <Route path="campaigns" element={<NGOCampaigns />} />
                <Route path="campaigns/new" element={<NGOCreateCampaign />} />
                <Route path="campaigns/edit/:id" element={<NGOCreateCampaign />} />
                <Route path="orders" element={<NGOOrders />} />
            </Route>

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

                {/* ─── New Admin Routes ─── */}
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="item-campaigns" element={<AdminItemCampaigns />} />
                <Route path="orders" element={<AdminOrders />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
