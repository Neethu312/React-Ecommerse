
import { Routes, Route } from 'react-router';
import axios from 'axios';
import './App.css';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useEffect, useState } from 'react';

function App() {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    axios.get('/api/cart-items')
      .then((response) => {

        setCartItems(response.data)
      })

  }, [])


  return (
    <Routes>
      <Route index element={<HomePage cartItems={cartItems} />}></Route>
      <Route path='checkout' element={<CheckoutPage cartItems={cartItems} />} />
      <Route path='orders' element={<OrdersPage />} />
      <Route path='tracking' element={<TrackingPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>


  )
}

export default App
