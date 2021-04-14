import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import './App.css';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';

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
        
        <Switch>

          <Route path="/login">
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

        </Switch>
      </div>
    </Router>
   
  );
}

export default App;
