import api from './api';

export const paymentService = {
    // Create Razorpay order
    createOrder: async (donationId) => {
        const response = await api.post('/payments/create-order', { donationId });
        return response.data;
    },

    // Verify payment
    verifyPayment: async (data) => {
        const response = await api.post('/payments/verify', data);
        return response.data;
    },

    // Load Razorpay script
    loadRazorpay: () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    // Process payment — returns a promise that resolves on success, rejects on cancel/fail
    processPayment: async (donationId, donorDetails) => {
        // Load Razorpay script
        const isScriptLoaded = await paymentService.loadRazorpay();
        if (!isScriptLoaded) {
            throw new Error('Failed to load payment gateway. Check your internet connection.');
        }

        // Create order
        const orderData = await paymentService.createOrder(donationId);

        return new Promise((resolve, reject) => {
            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Donation Platform',
                description: 'Campaign Donation',
                order_id: orderData.order.id,
                prefill: {
                    name: donorDetails.donorName || '',
                    email: donorDetails.donorEmail || '',
                    contact: donorDetails.donorPhone || '',
                },
                theme: {
                    color: '#6366f1',
                },
                handler: async (response) => {
                    try {
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            donationId: donationId,
                        });
                        resolve();
                        window.location.href = `/payment/success?donation=${donationId}`;
                    } catch (error) {
                        reject(error);
                        window.location.href = `/payment/failed?donation=${donationId}`;
                    }
                },
                modal: {
                    ondismiss: () => {
                        // User closed the payment modal — reject so the caller can reset state
                        reject(new Error('Payment cancelled by user'));
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        });
    },
};
