export class FilterButton {
  //Конструктор класса FilterButton
  constructor(filterData, quantity, newFilterButtonTemplate, handleClick = ()=>{}) {
    this._name = filterData.name;
    this._type = filterData.type;
    this._isActive = filterData.isActive;
    this._quantity = quantity;
    this._newFilterButtonTemplate = newFilterButtonTemplate;
    this._handleClick = handleClick;
  }

  //Метод создания темплейта новой кнопки
  _getTemplate() {
    const filterButtonTemplate = document.querySelector(this._newFilterButtonTemplate).content.firstElementChild.cloneNode(true);;
    return filterButtonTemplate;
  }

  //Обработчик клика по кнопке
  _handleFilterClick = (evt) => {
    evt.stopPropagation();
    this._handleClick(this._type);
  }

  //Навешивание лисенеров
  _setEventListeners = () => {
    this._newFilterButton.addEventListener('click', this._handleFilterClick);
  }

  //Метод добавления контента и поведения новой кнопки фильтра
  createFilterButton() {
    this._newFilterButton = this._getTemplate();
    if(this._isActive) this._newFilterButton.classList.add("filter-button_active");

    this._newFilterButtonLabel = this._newFilterButton.querySelector('.filter-button__label');
    this._newFilterButtonLabel.textContent = this._name;

    this._newFilterButtonQuantity = this._newFilterButton.querySelector('.filter-button__quantity');
    this._newFilterButtonQuantity.textContent = this._quantity;

    this._setEventListeners();
    return this._newFilterButton;
  }
}