import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./DeliveryOptions";
import axios from "axios";
import { useState } from "react";

function OrderSummaryItem({ cartItem, deliveryOptions, loadCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [quantityInput, setQuantityInput] = useState(cartItem.quantity);

    const product = cartItem.product || {};

    const selectedDeliveryOption = deliveryOptions.find(
        (deliveryOption) => deliveryOption.id === cartItem.deliveryOptionId
    );

    const deleteCartItem = async () => {
        try {
            await axios.delete(`/api/cart-items/${cartItem.productId}`);
            if (loadCart) {
                await loadCart();
            }
        } catch (error) {
            console.error('Failed to delete cart item:', error);
        }
    };

    const handleUpdateQuantity = async () => {
        const newQuantity = Number(quantityInput);
        if (!newQuantity || newQuantity < 1) {
            alert('Quantity must be a number greater than 0');
            return;
        }

        try {
            await axios.put(`/api/cart-items/${cartItem.productId}`, {
                quantity: newQuantity
            });
            if (loadCart) {
                await loadCart();
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update cart item:', error);
        }
    };

    return (
        <div className="cart-item-container">
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
                        {isEditing ? (
                            <>
                                <span>Quantity:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantityInput}
                                    onChange={(e) => setQuantityInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdateQuantity();
                                        }
                                    }}
                                    style={{
                                        width: '45px',
                                        marginLeft: '5px',
                                        marginRight: '8px',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc'
                                    }}
                                />
                                <span
                                    className="link-primary"
                                    style={{ cursor: 'pointer', marginRight: '8px' }}
                                    onClick={handleUpdateQuantity}
                                >
                                    Save
                                </span>
                                <span
                                    className="link-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setQuantityInput(cartItem.quantity);
                                    }}
                                >
                                    Cancel
                                </span>
                            </>
                        ) : (
                            <>
                                <span>
                                    Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                                </span>
                                <span
                                    className="update-quantity-link link-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setQuantityInput(cartItem.quantity);
                                        setIsEditing(true);
                                    }}
                                >
                                    Update
                                </span>
                                <span
                                    className="delete-quantity-link link-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={deleteCartItem}
                                >
                                    Delete
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem} loadCart={loadCart} />
            </div>
        </div>
    );
}

export function OrderSummary({ deliveryOptions = [], cartItems = [], loadCart }) {
    return (
        <div className="order-summary">
            {deliveryOptions.length > 0 && cartItems.map((cartItem) => (
                <OrderSummaryItem
                    key={cartItem.productId}
                    cartItem={cartItem}
                    deliveryOptions={deliveryOptions}
                    loadCart={loadCart}
                />
            ))}
        </div>
    );
}
