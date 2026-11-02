
import { formatMoney } from '../../utils/money';
import axios from 'axios';
import dayjs from 'dayjs';

export function DeliveryOptions({ deliveryOptions = [], cartItem, loadCart }) {

    return (

        <div className="delivery-options">
            <div className="delivery-options-title">
                Choose a delivery option:
            </div>
            {deliveryOptions.map((deliveryOption) => {
                let priceString = "FREE Shipping";
                if (deliveryOption.priceCents > 0) {
                    priceString = `$${formatMoney(deliveryOption.priceCents)} - Shipping`;
                }
                const updateDeliveryOption = async () => {
                    try {
                        await axios.put(`/api/cart-items/${cartItem.productId}`, {
                            deliveryOptionId: deliveryOption.id,
                        });
                        if (loadCart) {
                            await loadCart();
                        }
                    } catch (error) {
                        console.error('Failed to update delivery option:', error);
                    }
                };
                return (
                    <div key={deliveryOption.id} className="delivery-option"
                        onClick={updateDeliveryOption}>
                        <input type="radio"
                            checked={deliveryOption.id === cartItem.deliveryOptionId}
                            onChange={updateDeliveryOption}
                            className="delivery-option-input"
                            name={`delivery-option-${cartItem.productId}`} />
                        <div>
                            <div className="delivery-option-date">
                                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                            </div>
                            <div className="delivery-option-price">
                                {priceString}
                            </div>
                        </div>
                    </div>

                );
            })}
        </div>
    );
}