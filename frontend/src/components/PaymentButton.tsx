import React, { useState } from 'react';
import { CreditCard, Loader } from 'lucide-react';
import { api } from '../api';
import { loadRazorpay } from '../utils/razorpay';
import { useAuth } from '../auth-context';

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  orderId, 
  amount, 
  currency = 'INR', 
  onSuccess, 
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create payment order
      const paymentData = await api.createPaymentOrder(orderId, amount, currency);

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Zomato Lite',
        description: 'Food Order Payment',
        order_id: paymentData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            await api.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            onSuccess();
          } catch (err) {
            console.error('Payment verification failed:', err);
            onError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#EF4444',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      onError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 disabled:bg-gray-300 transition font-bold text-lg shadow-lg shadow-red-500/25 flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          Pay ₹{amount}
        </>
      )}
    </button>
  );
};

export default PaymentButton;
