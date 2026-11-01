
import './CheckoutPage.css';
import { CheckoutHeader } from './CheckoutHeader';



export function CheckoutPage({ cartItems = [] }) {
    return (
        <>
            <title>Checkout</title>
            <link rel="icon" href="cart-favicon.png" />
            <CheckoutHeader />

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <div className="order-summary">
                        {cartItems.map((cartItem) => {
                            const product = cartItem.product || {};
                            return (
                                <div key={cartItem.productId} className="cart-item-container">
                                    <div className="delivery-date">
                                        Delivery date: {cartItem.deliveryDate || 'Tuesday, June 21'}
                                    </div>

                                    <div className="cart-item-details-grid">
                                        <img className="product-image"
                                            src={product.image} />

                                        <div className="cart-item-details">
                                            <div className="product-name">
                                                {product.name}
                                            </div>
                                            <div className="product-price">
                                                ${(product.priceCents / 100).toFixed(2)}
                                            </div>
                                            <div className="product-quantity">
                                                <span>
                                                    Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                                                </span>
                                                <span className="update-quantity-link link-primary">
                                                    Update
                                                </span>
                                                <span className="delete-quantity-link link-primary">
                                                    Delete
                                                </span>
                                            </div>
                                        </div>

                                        <div className="delivery-options">
                                            <div className="delivery-options-title">
                                                Choose a delivery option:
                                            </div>
                                            <div className="delivery-option">
                                                <input type="radio"
                                                    defaultChecked={cartItem.deliveryOptionId === '1'}
                                                    className="delivery-option-input"
                                                    name={`delivery-option-${cartItem.productId}`} />
                                                <div>
                                                    <div className="delivery-option-date">
                                                        Tuesday, June 21
                                                    </div>
                                                    <div className="delivery-option-price">
                                                        FREE Shipping
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="delivery-option">
                                                <input type="radio"
                                                    defaultChecked={cartItem.deliveryOptionId === '2'}
                                                    className="delivery-option-input"
                                                    name={`delivery-option-${cartItem.productId}`} />
                                                <div>
                                                    <div className="delivery-option-date">
                                                        Wednesday, June 15
                                                    </div>
                                                    <div className="delivery-option-price">
                                                        $4.99 - Shipping
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="delivery-option">
                                                <input type="radio"
                                                    defaultChecked={cartItem.deliveryOptionId === '3'}
                                                    className="delivery-option-input"
                                                    name={`delivery-option-${cartItem.productId}`} />
                                                <div>
                                                    <div className="delivery-option-date">
                                                        Monday, June 13
                                                    </div>
                                                    <div className="delivery-option-price">
                                                        $9.99 - Shipping
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="payment-summary">
                        <div className="payment-summary-title">
                            Payment Summary
                        </div>

                        <div className="payment-summary-row">
                            <div>Items (3):</div>
                            <div className="payment-summary-money">$42.75</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Shipping &amp; handling:</div>
                            <div className="payment-summary-money">$4.99</div>
                        </div>

                        <div className="payment-summary-row subtotal-row">
                            <div>Total before tax:</div>
                            <div className="payment-summary-money">$47.74</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Estimated tax (10%):</div>
                            <div className="payment-summary-money">$4.77</div>
                        </div>

                        <div className="payment-summary-row total-row">
                            <div>Order total:</div>
                            <div className="payment-summary-money">$52.51</div>
                        </div>

                        <button className="place-order-button button-primary">
                            Place your order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}