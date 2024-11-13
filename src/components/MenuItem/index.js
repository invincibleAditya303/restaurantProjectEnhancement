import './index.css'

const MenuItem = props => {
  const {menuDetails, onClickCategory, isActive} = props
  const {categoryType, categoryId} = menuDetails

  const onClickMenu = () => onClickCategory(categoryId)
  const activeClassName = isActive ? 'highlight' : ''

  return (
    <li>
      <button
        className={`menuItem ${activeClassName}`}
        onClick={onClickMenu}
        type="button"
      >
        {categoryType}
      </button>
    </li>
  )
}

export default MenuItem
