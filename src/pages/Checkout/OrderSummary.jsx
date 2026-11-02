import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./DeliveryOptions";

export function OrderSummary({ deliveryOptions = [], cartItems = [] }) {
    return (
        <div className="order-summary">
            {deliveryOptions.length > 0 && cartItems.map((cartItem) => {
                const product = cartItem.product || {};

                const selectedDeliveryOption = deliveryOptions.find(
                    (deliveryOption) => deliveryOption.id === cartItem.deliveryOptionId
                );

                return (
                    <div key={cartItem.productId} className="cart-item-container">
                        <div className="delivery-date">
                            Delivery date: {selectedDeliveryOption ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D') : ''}
                        </div>

                        <div className="cart-item-details-grid">
                            <img className="product-image"
                                src={product.image} />

                            <div className="cart-item-details">
                                <div className="product-name">
                                    {product.name}
                                </div>
                                <div className="product-price">
                                    ${formatMoney(product.priceCents)}
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

                            <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
