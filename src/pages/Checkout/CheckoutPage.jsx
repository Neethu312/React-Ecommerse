
import './CheckoutPage.css';
import { CheckoutHeader } from './CheckoutHeader';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';

export function CheckoutPage({ cartItems = [], loadCart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState(null);

    // 1. Fetch delivery options once on initial mount (static configuration)
    useEffect(() => {
        let isMounted = true;

        const fetchDeliveryOptions = async () => {
            try {
                const response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
                if (isMounted) {
                    setDeliveryOptions(response.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to fetch delivery options:', error);
                }
            }
        };

        fetchDeliveryOptions();

        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Fetch payment summary on mount and whenever cartItems change
    useEffect(() => {
        let isMounted = true;

        const fetchPaymentSummary = async () => {
            try {
                const response = await axios.get('/api/payment-summary');
                if (isMounted) {
                    setPaymentSummary(response.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to fetch payment summary:', error);
                }
            }
        };

        fetchPaymentSummary();

        return () => {
            isMounted = false;
        };
    }, [cartItems]);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" href="cart-favicon.png" />
            <CheckoutHeader cartItems={cartItems} />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <OrderSummary deliveryOptions={deliveryOptions} cartItems={cartItems} loadCart={loadCart} />
                    <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
                </div>
            </div>
        </>
    );
}