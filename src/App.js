import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  decrementCartItemQuantity = productId => {
    const {cartList} = this.state
    const deleteItem = cartList.filter(
      eachproduct => eachproduct.dishId === productId,
    )
    console.log(deleteItem[0])

    if (deleteItem[0].quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachproduct => {
          if (eachproduct.dishId === productId) {
            const quantity = eachproduct.quantity - 1
            return {...eachproduct, quantity}
          }
          return eachproduct
        }),
      }))
    } else {
      this.setState(prevState => ({
        cartList: prevState.cartList.filter(
          eachproduct => eachproduct.dishId !== productId,
        ),
      }))
    }
  }

  incrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachproduct => {
        if (eachproduct.dishId === productId) {
          const quantity = eachproduct.quantity + 1
          return {...eachproduct, quantity}
        }
        return eachproduct
      }),
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  removeCartItem = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(
        eachproduct => eachproduct.dishId !== productId,
      ),
    }))
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = dish => {
    const {cartList} = this.state
    const cartProduct = cartList.find(
      eachproduct => eachproduct.dishId === dish.dishId,
    )
    console.log(cartProduct)
    if (cartProduct === undefined) {
      this.setState(prevState => ({cartList: [...prevState.cartList, dish]}))
    } else {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachproduct => {
          if (eachproduct.dishId === cartProduct.dishId) {
            return {...eachproduct, quantity: eachproduct.quantity + 1}
          }
          return eachproduct
        }),
      }))
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
