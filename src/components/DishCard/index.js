import CartContext from '../../context/CartContext'

import './index.css'

const DishCard = props => {
  const {dishDetails, onClickIncrement, onClickDecrement, cartItems} = props
  const {
    dishName,
    dishId,
    dishPrice,
    dishImage,
    dishCurrency,
    dishCalories,
    dishDescription,
    dishAvailability,
    dishType,
    addonCat,
  } = dishDetails

  const currentItem = cartItems.find(item => item.dishId === dishId)
  console.log(currentItem)

  const getQuantity = () => (currentItem ? currentItem.quantity : 0)

  const onClickPlus = () => onClickIncrement(dishDetails)
  const onClickMinus = () => onClickDecrement(dishDetails)

  const isVeg = dishType === 2 ? 'vegDish' : 'nonVegDish'
  const borderLine = dishType === 2 ? 'vegBorder' : 'nonVegBorder'

  return (
    <CartContext.Consumer>
      {value => {
        const {addCartItem} = value
        const onClickAddToCart = () => {
          addCartItem(currentItem)
        }

        return (
          <li className="cardListItem">
            <div className="dishContainer">
              <div className={`dishType ${borderLine}`}>
                <p className={`dishColor ${isVeg}`}>{}</p>
              </div>
              <div className="dishDetailsContainer">
                <p className="dishName">{dishName}</p>
                <p className="dishCurrency">
                  {dishCurrency} {dishPrice}
                </p>
                <p className="dishDescription">{dishDescription}</p>
                <div className="buttonsContainer">
                  {dishAvailability && (
                    <div className="buttonContainer">
                      <button
                        className="buttonIcon"
                        type="button"
                        onClick={onClickMinus}
                      >
                        -
                      </button>
                      <p className="dishCount">{getQuantity()}</p>
                      <button
                        className="buttonIcon"
                        type="button"
                        onClick={onClickPlus}
                      >
                        +
                      </button>
                    </div>
                  )}
                  {currentItem && (
                    <button
                      type="button"
                      className="cart-button"
                      onClick={onClickAddToCart}
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
                {!dishAvailability && (
                  <p className="dishStatus">Not available</p>
                )}
                {addonCat.length === 0 && (
                  <p className="dishCustomization">Customizations available</p>
                )}
              </div>
            </div>
            <div className="caloriesContainer">
              <p className="caloriesDetails">{dishCalories} calories</p>
            </div>
            <img src={dishImage} className="dishImage" alt={dishName} />
          </li>
        )
      }}
    </CartContext.Consumer>
  )
}

export default DishCard
