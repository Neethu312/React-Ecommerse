import { Header } from '../../components/Header';
import { ProductsGrid } from '../ProductsGrid';

import './HomePage.css';
import axios from 'axios';

import { useEffect, useState } from 'react';

export function HomePage({ cartItems }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then((response) => {
                setProducts(response.data)
            })


    }, [])
    return (
        <>
            <title>Ecommerse Project</title>
            <link rel="icon" href="home-favicon.png" />
            <Header cartItems={cartItems} />

            <div className="home-page">
                <ProductsGrid products={products} />
            </div>
        </>
    );
}