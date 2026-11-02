import { Header } from '../components/Header';
import './OrdersPage.css';
import { Link } from 'react-router';
import buyAgainIcon from '../assets/images/icons/buy-again.png';
import axios from 'axios';
import { useEffect, useState, Fragment } from 'react';
import dayjs from 'dayjs';
import formatMoney from '../utils/money';

export function OrdersPage({ cartItems }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders?expand=products')
      .then((response) => {
        setOrders(response.data)
      })
  }, [])

  return (
    <>
      <title>Orders</title>
      <link rel="icon" href="orders-favicon.png" />
      <Header cartItems={cartItems} />


      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            <div key={order.id} className="order-container">

              <div className="order-header">
                <div className="order-header-left-section">
                  <div className="order-date">
                    <div className="order-header-label">Order Placed:</div>
                    <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                  </div>
                  <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>{formatMoney(order.totalCostCents)}</div>
                  </div>
                </div>

                <div className="order-header-right-section">
                  <div className="order-header-label">Order ID:</div>
                  <div>{order.id}</div>
                </div>
              </div>

              <div className="order-details-grid">
                {order.products.map((orderProduct) => {
                  return (
                    <Fragment key={orderProduct.productId}>
                      <div className="product-image-container">
                        <img src={orderProduct.product.image} />
                      </div>

                      <div className="product-details">
                        <div className="product-name">
                          {orderProduct.product.name}
                        </div>
                        <div className="product-delivery-date">
                          Arriving on:{dayjs(orderProduct.estimateDeliveryDayMs).format('MMMM D')}
                        </div>
                        <div className="product-quantity">
                          Quantity: {orderProduct.quantity}
                        </div>
                        <button className="buy-again-button button-primary">
                          <img className="buy-again-icon" src={buyAgainIcon} />
                          <span className="buy-again-message">Add to Cart</span>
                        </button>
                      </div>

                      <div className="product-actions">
                        <Link to="/tracking">
                          <button className="track-package-button button-secondary">
                            Track package
                          </button>
                        </Link>
                      </div>

                      <div className="product-image-container">
                        <img src="images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg" />
                      </div>

                      <div className="product-details">
                        <div className="product-name">
                          {orderProduct.product.name}
                        </div>
                        <div className="product-delivery-date">
                          {dayjs(orderProduct.estimateDeliveryDayMs).format('MMMM D')}
                        </div>
                        <div className="product-quantity">
                          Quantity: {orderProduct.quantity}
                        </div>
                        <button className="buy-again-button button-primary">
                          <img className="buy-again-icon" src={buyAgainIcon} />
                          <span className="buy-again-message">Add to Cart</span>
                        </button>
                      </div>

                      <div className="product-actions"></div>
                    </Fragment>
                  )
                })}


              </div>
            </div>

          })}




          <div className="order-header">
            <div className="order-header-left-section">
              <div className="order-date">
                <div className="order-header-label">Order Placed:</div>
                <div>June 10</div>
              </div>
              <div className="order-total">
                <div className="order-header-label">Total:</div>
                <div>$41.90</div>
              </div>
            </div>

            <div className="order-header-right-section">
              <div className="order-header-label">Order ID:</div>
              <div>b6b6c212-d30e-4d4a-805d-90b52ce6b37d</div>
            </div>
          </div>

          <div className="order-details-grid">
            <div className="product-image-container">
              <img src="images/products/intermediate-composite-basketball.jpg" />
            </div>

            <div className="product-details">
              <div className="product-name">
                Intermediate Size Basketball
              </div>
              <div className="product-delivery-date">
                Arriving on: June 17
              </div>
              <div className="product-quantity">
                Quantity: 2
              </div>
              <button className="buy-again-button button-primary">
                <img className="buy-again-icon" src={buyAgainIcon} />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              <Link to="/tracking">
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>

  );

}