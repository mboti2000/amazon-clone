import React from 'react';
import './Product.css';
import { useStateValue } from './StateProvider';

import { store } from 'react-notifications-component';


const Product = ({ id, title, image, price, rating }) =>{
    const [state, dispatch] = useStateValue();


    const addToBasket = () =>{
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id,
                title,
                image,
                price,
                rating
            }
        });

        store.addNotification({
            title: "Success",
            message: "Item added to the basket!",
            type: "success",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 1500,
              onScreen: true
            }
        });
    };

    return(
        <div className="product">
            <div className="product__info">
                <p>{title}</p>
                <p className="product__price">
                    <small>$</small>
                    <strong>{price}</strong>
                </p>
                <div className="product__rating">
                    {Array(rating).fill().map((_,i) => <p>⭐</p>)}
                </div>
            </div>

            <img src={image} alt="" />

            <button onClick={addToBasket} >Add to Basket</button>
        </div>
    );
};

export default Product;