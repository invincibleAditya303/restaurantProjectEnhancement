import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiOutlineShoppingCart} from 'react-icons/ai'

import CartContext from '../../context/CartContext'

import './index.css'

const Header = props => {
  const renderCartItemsCount = () => (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length

        return (
          <>
            {cartItemsCount > 0 ? (
              <span className="cart-count-badge">{cartList.length}</span>
            ) : null}
          </>
        )
      }}
    </CartContext.Consumer>
  )

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="restaurantTitelContainer">
      <Link to="/">
        <h1 className="restaurantTitle">UNI Resto Cafe</h1>
      </Link>
      <div className="ordersContainer">
        <p className="orderTitle">My Orders</p>
        <Link to="/cart">
          <div className="cartContainer">
            <div className="countContainer">{renderCartItemsCount()}</div>
            <AiOutlineShoppingCart className="cartIcon" />
          </div>
        </Link>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
        <button
          type="button"
          className="nav-mobile-btn"
          onClick={onClickLogout}
        >
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
            alt="nav logout"
            className="nav-bar-img"
          />
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
