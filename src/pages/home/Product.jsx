import { useState, useRef, useEffect } from "react";
import { formatMoney } from "../../utils/money";
import checkmarkIcon from '../../assets/images/icons/checkmark.png';
import axios from 'axios';

export function Product({ product, loadCart }) {
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const timeoutIdRef = useRef(null);

    // Clean up timer when component unmounts to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    const addToCart = async () => {
        // Prevent multiple clicks while request is processing
        if (status === 'loading') {
            return;
        }

        setStatus('loading');

        try {
            await axios.post('/api/cart-items', {
                productId: product.id,
                quantity: quantity
            });

            if (loadCart) {
                await loadCart();
            }

            setStatus('success');

            // Clear previous timeout if user clicked again
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }

            // Return to 'idle' state after 2 seconds
            timeoutIdRef.current = setTimeout(() => {
                setStatus('idle');
            }, 2000);

        } catch (error) {
            console.error('Failed to add product to cart:', error);
            setStatus('error');

            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }

            // Return to 'idle' state after 2 seconds on error as well
            timeoutIdRef.current = setTimeout(() => {
                setStatus('idle');
            }, 2000);
        }
    };

    const selectQuantity = (event) => {
        const quantitySelected = Number(event.target.value);
        setQuantity(quantitySelected);
    };

    return (
        <div className="product-container">
            <div className="product-image-container">
                <img className="product-image"
                    src={product.image} />
            </div>

            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img className="product-rating-stars"
                    src={`images/ratings/rating-${product.rating.stars * 10}.png`} />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                ${formatMoney(product.priceCents)}
            </div>

            <div className="product-quantity-container">
                <select value={quantity} onChange={selectQuantity}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="product-spacer"></div>

            <div
                className="added-to-cart"
                style={{ opacity: status === 'success' ? 1 : 0, transition: 'opacity 0.3s' }}
            >
                <img src={checkmarkIcon} />
                Added
            </div>

            <button
                className="add-to-cart-button button-primary"
                disabled={status === 'loading'}
                onClick={addToCart}
                style={
                    status === 'error'
                        ? { backgroundColor: '#dc3545', borderColor: '#dc3545' }
                        : status === 'loading'
                        ? { opacity: 0.8, cursor: 'not-allowed' }
                        : {}
                }
            >
                {status === 'loading' && 'Adding...'}
                {status === 'success' && 'Added ✓'}
                {status === 'error' && 'Failed! Try again'}
                {status === 'idle' && 'Add to Cart'}
            </button>
        </div>
    );
}