import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import './App.css';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Payment from './Payment';
import Orders from './Orders';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';

import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import { loadStripe } from '@stripe/stripe-js';
import  { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe('pk_test_51IgPOYI2LM9IW1imA1dxjdjShHz67XU6FoDspLX7eNTCwUphizUwlxJTLuH53Otpvrs9KPN8U36v6lokkxCQ58kq00fE05L4DT');

function App() {
  const [state, dispatch] = useStateValue();

  useEffect(() =>{

    auth.onAuthStateChanged(authUser => {
      if(authUser){

        dispatch({ type: 'SET_USER', user: authUser });

      } else{

        dispatch({ type: 'SET_USER', user: null });
      }
    });

  },[]);

  return (
    <Router>
      <div className="app">
      <ReactNotification />
        
        <Switch>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/">
            <Header />
            <Home />
          </Route>

          <Route exact path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route exact path="/payment">
            <Header />

            <Elements stripe={promise}>
              <Payment />
            </Elements>
            
          </Route>

          <Route exact path="/orders">
            <Header />
            <Orders />
          </Route>

        </Switch>
      </div>
    </Router>
   
  );
}

export default App;
