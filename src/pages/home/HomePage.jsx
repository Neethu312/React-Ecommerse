import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';

import './HomePage.css';
import axios from 'axios';

import { useEffect, useState } from 'react';

export function HomePage({ cartItems, loadCart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, []);
    return (
        <>
            <title>Ecommerse Project</title>
            <link rel="icon" href="home-favicon.png" />
            <Header cartItems={cartItems} />

            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart} />
            </div>
        </>
    );
}