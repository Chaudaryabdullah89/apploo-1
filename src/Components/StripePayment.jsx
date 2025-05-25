import React, { lazy, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import LoadingSpinner from './LoadingSpinner';

// Lazy load the PaymentForm component
const PaymentForm = lazy(() => import('./PaymentForm'));

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key');

const StripePayment = ({ amount, onSuccess, onError }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Elements stripe={stripePromise}>
        <Suspense fallback={<LoadingSpinner />}>
          <PaymentForm 
            amount={amount} 
            onSuccess={onSuccess} 
            onError={onError} 
          />
        </Suspense>
      </Elements>
    </div>
  );
};

export default StripePayment; 