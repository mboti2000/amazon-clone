import React, { useEffect, useState } from 'react';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import { useStateValue } from './StateProvider';
import { db } from './firebase';

import { Link } from 'react-router-dom';
import FlipMove from 'react-flip-move';
import CurrencyFormat from 'react-currency-format';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { getBasketTotal } from './reducer';
import axios from './axios';
import  { useHistory } from 'react-router-dom';

const Payment = () =>{
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const [error,setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [processing, setProcessing] = useState("");
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() =>{
        const getclientSecret = async () =>{
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret);
        };

        getclientSecret();

    }, [basket]);

    console.log(clientSecret);
 
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) =>{

            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({ type: 'EMPTY_BASKET'});

            history.replace('/orders');
        });
    };

    const handleChange = (e) =>{
        setDisabled(e.empty);
        setError(e.error ? e.error.message : '');
    };

    return (
        <div className="payment">
            <div className="payment__container">

                <h1>Checkout (<Link to="/checkout">{basket?.length} {basket?.length > 1 ? 'items' : 'item'}</Link>)</h1>
                <div className="payment__section">

                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>

                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Line</p>
                        <p>Los Angeles, CA</p>
                    </div>

                </div>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">

                        <FlipMove>
                        {basket.map(item => {
                            return <CheckoutProduct 
                                        key={Math.random()}
                                        id={item.id}
                                        image={item.image}
                                        price={item.price}
                                        rating={item.rating}
                                        title={item.title}
                                    />
                        })}
                        </FlipMove>
                        
                    </div>
                </div>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>

                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)} 
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>

                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;