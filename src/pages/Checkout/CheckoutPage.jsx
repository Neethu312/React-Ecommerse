
import './CheckoutPage.css';
import { CheckoutHeader } from './CheckoutHeader';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';

export function CheckoutPage({ cartItems = [] }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState();


    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const [deliveryOptionsResponse, paymentSummaryResponse] = await Promise.all([
                    axios.get('/api/delivery-options?expand=estimatedDeliveryTime'),
                    axios.get('/api/payment-summary')
                ]);
                setDeliveryOptions(deliveryOptionsResponse.data);
                setPaymentSummary(paymentSummaryResponse.data);
            } catch (error) {
                console.error('Failed to fetch checkout data:', error);
            }
        };

        fetchCheckoutData();
    }, []);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" href="cart-favicon.png" />
            <CheckoutHeader cartItems={cartItems} />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <OrderSummary deliveryOptions={deliveryOptions} cartItems={cartItems} />
                    <PaymentSummary paymentSummary={paymentSummary} />
                </div>
            </div>
        </>
    );
}