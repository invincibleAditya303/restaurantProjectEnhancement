import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {AiOutlineShoppingCart} from 'react-icons/ai'

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
    cartCount: 0,
    dishCountList: [],
    dishIdList: [],
    tabIdList: [],
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
      dishCountList: tableMenuList[0].categoryDishes.map(eachDish => ({
        countDishId: eachDish.dishId,
        eachDishCount: 0,
      })),
    })
  }

  onClickCategory = tabId => {
    const {restaurantData, tabIdList} = this.state
    console.log(tabIdList)
    const {tableMenuList} = restaurantData
    const currentCategory = menuCategoryList.filter(
      item => item.categoryId === tabId,
    )
    const activeMenuList = tableMenuList.filter(
      eachCategory =>
        eachCategory.menuCategory === currentCategory[0].categoryType,
    )
    console.log(activeMenuList)

    if (tabIdList.includes(tabId)) {
      this.setState({
        activeTabId: tabId,
        dishCountList: activeMenuList[0].categoryDishes.map(eachDish => ({
          countDishId: eachDish.dishId,
          eachDishCount: 0,
        })),
      })
    } else {
      this.setState({
        activeTabId: tabId,
        dishCountList: activeMenuList[0].categoryDishes.map(eachDish => ({
          countDishId: eachDish.dishId,
          eachDishCount: 0,
        })),
        tabIdList: [...tabIdList, tabId],
      })
    }
  }

  onClickIncrement = id => {
    const {dishIdList} = this.state
    if (dishIdList.includes(id)) {
      this.setState(prevState => ({
        dishCountList: prevState.dishCountList.map(eachDish => {
          if (eachDish.countDishId === id) {
            return {...eachDish, eachDishCount: eachDish.eachDishCount + 1}
          }

          return eachDish
        }),
        cartCount: prevState.cartCount + 1,
      }))
    } else {
      this.setState(prevState => ({
        dishIdList: [...prevState.dishIdList, id],
        dishCountList: prevState.dishCountList.map(eachDish => {
          if (eachDish.countDishId === id) {
            return {...eachDish, eachDishCount: eachDish.eachDishCount + 1}
          }

          return eachDish
        }),
        cartCount: prevState.cartCount + 1,
      }))
    }
  }

  onClickDecrement = id => {
    const {cartCount, dishCountList} = this.state
    const currentId = dishCountList.filter(dish => dish.countDishId === id)

    if (cartCount > 0) {
      if (currentId[0].eachDishCount > 0) {
        this.setState(prevState => ({
          dishCountList: prevState.dishCountList.map(eachDish => {
            if (eachDish.countDishId === id) {
              return {...eachDish, eachDishCount: eachDish.eachDishCount - 1}
            }

            return eachDish
          }),
          cartCount: prevState.cartCount - 1,
        }))
      }
    }
  }

  onSuccessfulRender = () => {
    const {restaurantData, activeTabId, dishCountList} = this.state
    const {tableMenuList} = restaurantData

    const activeMenuCategory = menuCategoryList.filter(
      eachItem => eachItem.categoryId === activeTabId,
    )

    const currentMenuList = tableMenuList.filter(
      eachMenuItem =>
        eachMenuItem.menuCategory === activeMenuCategory[0].categoryType,
    )

    const itemList = currentMenuList[0].categoryDishes

    return (
      <ul className="dishList">
        {itemList.map(eachItem => (
          <DishCard
            key={eachItem.dishId}
            dishDetails={eachItem}
            dishCountList={dishCountList}
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
    const {restaurantData, apiStatus, activeTabId, cartCount} = this.state
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
        <div className="restaurantTitelContainer">
          <h1 className="restaurantTitle">{restaurantName}</h1>
          <div className="ordersContainer">
            <p className="orderTitle">My Orders</p>
            <div className="cartContainer">
              <div className="countContainer">
                <p className="countDetails">{cartCount}</p>
              </div>
              <AiOutlineShoppingCart className="cartIcon" />
            </div>
          </div>
        </div>
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
        {renderFunction()}
      </div>
    )
  }
}

export default Home
