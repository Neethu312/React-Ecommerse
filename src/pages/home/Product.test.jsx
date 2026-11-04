import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Product } from './Product';

// Mock axios so we don't hit the real backend in tests
vi.mock('axios');

describe('Product Component', () => {
    const mockProduct = {
        id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
        name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
        rating: {
            stars: 4.5,
            count: 87
        },
        priceCents: 1090,
        keywords: ['socks', 'sports', 'apparel']
    };

    let mockLoadCart;

    beforeEach(() => {
        // Reset all mocks before each test to ensure test isolation
        vi.clearAllMocks();
        mockLoadCart = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering Tests', () => {
        it('renders product details correctly (name, price, image, rating)', () => {
            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            // 1. Verify Product Name
            expect(screen.getByText('Black and Gray Athletic Cotton Socks - 6 Pairs')).toBeInTheDocument();

            // 2. Verify Product Price ($10.90)
            expect(screen.getByText('$10.90')).toBeInTheDocument();

            // 3. Verify Product Image
            const productImages = screen.getAllByRole('img');
            const mainImage = productImages.find(img => img.getAttribute('src') === mockProduct.image);
            expect(mainImage).toBeInTheDocument();

            // 4. Verify Rating Count and Rating Stars Image
            expect(screen.getByText('87')).toBeInTheDocument();
            const ratingImage = productImages.find(img => img.getAttribute('src') === 'images/ratings/rating-45.png');
            expect(ratingImage).toBeInTheDocument();

            // 5. Verify Quantity Dropdown defaults to 1
            const selectElement = screen.getByRole('combobox');
            expect(selectElement).toBeInTheDocument();
            expect(selectElement.value).toBe('1');

            // 6. Verify Add to Cart button is present
            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            expect(addToCartButton).toBeInTheDocument();
            expect(addToCartButton).not.toBeDisabled();
        });
    });

    describe('User Interaction and API Integration Tests', () => {
        it('adds product to cart with default quantity 1 on button click', async () => {
            const user = userEvent.setup();
            axios.post.mockResolvedValueOnce({ data: { message: 'Item added' } });

            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            await user.click(addToCartButton);

            // 1. Verify axios.post was called with correct endpoint and payload
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 1
            });

            // 2. Verify loadCart callback was triggered
            expect(mockLoadCart).toHaveBeenCalledTimes(1);

            // 3. Verify success state in the UI
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /added ✓/i })).toBeInTheDocument();
            });
        });

        it('allows user to change quantity and sends selected quantity to API', async () => {
            const user = userEvent.setup();
            axios.post.mockResolvedValueOnce({ data: { message: 'Item added' } });

            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            // 1. Change quantity to 3
            const selectElement = screen.getByRole('combobox');
            await user.selectOptions(selectElement, '3');
            expect(selectElement.value).toBe('3');

            // 2. Click Add to Cart
            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            await user.click(addToCartButton);

            // 3. Verify API payload has quantity: 3
            expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 3
            });
            expect(mockLoadCart).toHaveBeenCalledTimes(1);
        });

        it('shows loading state while request is processing and prevents duplicate clicks', async () => {
            const user = userEvent.setup();

            // Create a pending promise to keep request in loading state
            let resolveApiCall;
            const pendingPromise = new Promise(resolve => {
                resolveApiCall = resolve;
            });
            axios.post.mockReturnValueOnce(pendingPromise);

            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            await user.click(addToCartButton);

            // Button should now show "Adding..." and be disabled
            expect(screen.getByRole('button', { name: /adding\.\.\./i })).toBeInTheDocument();
            expect(addToCartButton).toBeDisabled();

            // Try clicking again while disabled - should not trigger another call
            await user.click(addToCartButton);
            expect(axios.post).toHaveBeenCalledTimes(1);

            // Resolve the API call to complete the test cleanly
            resolveApiCall({ data: { message: 'Done' } });
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /added ✓/i })).toBeInTheDocument();
            });
        });

        it('handles API error properly and displays error state on button', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const user = userEvent.setup();
            // Mock API error
            axios.post.mockRejectedValueOnce(new Error('Network error'));

            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            await user.click(addToCartButton);

            // 1. Verify button displays error message
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /failed! try again/i })).toBeInTheDocument();
            });

            // 2. Verify loadCart was NOT called due to error
            expect(mockLoadCart).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('reverts back to idle state (Add to Cart) after 2 seconds timeout', async () => {
            vi.useFakeTimers({ shouldAdvanceTime: true });
            axios.post.mockResolvedValueOnce({ data: { message: 'Item added' } });

            render(<Product product={mockProduct} loadCart={mockLoadCart} />);

            const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
            
            // Fire click event
            fireEvent.click(addToCartButton);

            // Wait for axios promise to resolve and state to become 'success'
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /added ✓/i })).toBeInTheDocument();
            });

            // Fast-forward time by 2000ms (2 seconds)
            act(() => {
                vi.advanceTimersByTime(2000);
            });

            // Verify button returned to original "Add to Cart" state
            expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();

            vi.useRealTimers();
        });
    });
});
