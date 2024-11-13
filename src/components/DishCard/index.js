import './index.css'

const DishCard = props => {
  const {dishDetails, onClickIncrement, onClickDecrement, dishCountList} = props
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

  const currentDishId = dishCountList.filter(
    eachId => eachId.countDishId === dishId,
  )

  const currentDishCount = currentDishId[0].eachDishCount

  const onClickPlus = () => onClickIncrement(dishId)
  const onClickMinus = () => onClickDecrement(dishId)

  const isVeg = dishType === 2 ? 'vegDish' : 'nonVegDish'
  const borderLine = dishType === 2 ? 'vegBorder' : 'nonVegBorder'
  const isAvailable = dishAvailability ? '' : 'hideButton'

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
          <div className={`buttonContainer ${isAvailable}`}>
            <button className="buttonIcon" type="button" onClick={onClickMinus}>
              -
            </button>
            <p className="dishCount">{currentDishCount}</p>
            <button className="buttonIcon" type="button" onClick={onClickPlus}>
              +
            </button>
          </div>
          {dishAvailability ? '' : <p className="dishStatus">Not available</p>}
          {addonCat.length === 0 ? (
            ''
          ) : (
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
}

export default DishCard
