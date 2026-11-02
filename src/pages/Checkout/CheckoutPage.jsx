
import './CheckoutPage.css';
import { CheckoutHeader } from './CheckoutHeader';
import { formatMoney } from '../../utils/money';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { OrderSummary } from '../OrderSummary';
import { PaymentSummary } from './PaymentSummary';

export function CheckoutPage({ cartItems = [] }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState();


    useEffect(() => {
        axios.get('/api/delivery-options?expand=estimatedDeliveryTime')
            .then((response) => {
                setDeliveryOptions(response.data);
            });
        axios.get('/api/payment-summary')
            .then((response) => {
                setPaymentSummary(response.data);
            });
    }, []);

    return (
        <>
            <title>Checkout</title>
            <link rel="icon" href="cart-favicon.png" />
            <CheckoutHeader />

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