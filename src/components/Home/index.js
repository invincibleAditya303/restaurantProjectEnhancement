import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import DishCard from '../DishCard'

import MenuItem from '../MenuItem'

import './index.css'

const menuCategoryList = [
  {
    categoryId: 'SALADS AND SOUP',
    categoryType: 'Salads and Soup',
  },
  {
    categoryId: 'FROM THE BARNYARD',
    categoryType: 'From The Barnyard',
  },
  {
    categoryId: 'FROM THE HEN HOUSE',
    categoryType: 'From the Hen House',
  },
  {
    categoryId: 'FRESH FROM THE SEA',
    categoryType: 'Fresh From The Sea',
  },
  {
    categoryId: 'BIRYANI',
    categoryType: 'Biryani',
  },
  {
    categoryId: 'FAST FOOD',
    categoryType: 'Fast Food',
  },
]

const apiStatusConstants = {
  initial: 'INTIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
}

class Home extends Component {
  state = {
    restaurantData: {},
    activeTabId: menuCategoryList[0].categoryId,
    apiStatus: apiStatusConstants.initial,
    cartItems: [],
  }

  componentDidMount() {
    this.getRestaurantData()
  }

  getRestaurantData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const api =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const response = await fetch(api)
    const data = await response.json()

    const tableMenuList = data[0].table_menu_list.map(eachDish => ({
      menuCategory: eachDish.menu_category,
      menuCategoryId: eachDish.menu_category_id,
      menuCategoryImage: eachDish.menu_category_image,
      nexturl: eachDish.nexturl,
      categoryDishes: eachDish.category_dishes.map(eachCategoryDish => ({
        dishId: eachCategoryDish.dish_id,
        dishName: eachCategoryDish.dish_name,
        dishPrice: eachCategoryDish.dish_price,
        dishImage: eachCategoryDish.dish_image,
        dishCurrency: eachCategoryDish.dish_currency,
        dishCalories: eachCategoryDish.dish_calories,
        dishDescription: eachCategoryDish.dish_description,
        dishAvailability: eachCategoryDish.dish_Availability,
        dishType: eachCategoryDish.dish_Type,
        nexturl: eachCategoryDish.nexturl,
        addonCat: eachCategoryDish.addonCat,
      })),
    }))

    const modifiedData = {
      restaurantId: data[0].restaurant_id,
      restaurantImage: data[0].restaurant_image,
      restaurantName: data[0].restaurant_name,
      tableMenuList,
    }

    this.setState({
      restaurantData: modifiedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onClickCategory = tabId => {
    this.setState({activeTabId: tabId})
  }

  onClickIncrement = dish => {
    const {cartItems} = this.state
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (isAlreadyExists) {
      this.setState(prevState => ({
        cartItems: prevState.cartItems.map(eachDish => {
          if (eachDish.dishId === dish.dishId) {
            return {...eachDish, quantity: eachDish.quantity + 1}
          }

          return eachDish
        }),
      }))
    } else {
      const newDish = {...dish, quantity: 1}
      this.setState(prevState => ({
        cartItems: [...prevState.cartItems, newDish],
      }))
    }
  }

  onClickDecrement = dish => {
    const {cartItems} = this.state
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    console.log(isAlreadyExists)

    if (isAlreadyExists) {
      this.setState(prevState => ({
        cartItems: prevState.cartItems.map(eachDish => {
          if (eachDish.dishId === dish.dishId && eachDish.quantity > 0) {
            return {...eachDish, quantity: eachDish.quantity - 1}
          }

          return eachDish
        }),
      }))
    }
  }

  onSuccessfulRender = () => {
    const {restaurantData, activeTabId, cartItems} = this.state
    const {tableMenuList} = restaurantData

    const activeMenuCategory = menuCategoryList.filter(
      eachItem => eachItem.categoryId === activeTabId,
    )

    const currentMenuList = tableMenuList.filter(
      eachMenuItem =>
        eachMenuItem.menuCategory === activeMenuCategory[0].categoryType,
    )

    const itemList = currentMenuList[0].categoryDishes

    console.log(cartItems)

    return (
      <ul className="dishList">
        {itemList.map(eachItem => (
          <DishCard
            key={eachItem.dishId}
            dishDetails={eachItem}
            cartItems={cartItems}
            onClickIncrement={this.onClickIncrement}
            onClickDecrement={this.onClickDecrement}
          />
        ))}
      </ul>
    )
  }

  onLoading = () => (
    <div data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#00bfff"
        height={50}
        width={50}
        className="loaderContainer"
      />
    </div>
  )

  render() {
    const {restaurantData, apiStatus, activeTabId} = this.state
    const {restaurantName} = restaurantData

    const renderFunction = () => {
      switch (apiStatus) {
        case apiStatusConstants.success:
          return this.onSuccessfulRender()
        case apiStatusConstants.loading:
          return this.onLoading()
        default:
          return null
      }
    }

    return (
      <div className="restaurantBgContainer">
        <Header />
        <hr className="breakLine" />
        <ul className="menuList">
          {menuCategoryList.map(eachItem => (
            <MenuItem
              key={eachItem.categoryId}
              menuDetails={eachItem}
              onClickCategory={this.onClickCategory}
              isActive={activeTabId === eachItem.categoryId}
            />
          ))}
        </ul>
        <hr className="breakLine" />
        {renderFunction()}
      </div>
    )
  }
}

export default Home
