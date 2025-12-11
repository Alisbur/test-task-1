export class Card {
  //Конструктор класса Card
  constructor(cardData, newCardTemplate, handleCardClick = ()=>{}) {
    this._type = cardData.type;
    this._title = cardData.title;
    this._tag = cardData.tag;
    this._image = cardData.image;
    this._price = cardData.price;
    this._lecturer = cardData.lecturer;
    this._newCardTemplate = newCardTemplate;
    this._handleCardClick = handleCardClick;
  }

  //Метод создания темплейта новой карточки
  _getTemplate() {
    const cardTemplate = document.querySelector(this._newCardTemplate).content.firstElementChild.cloneNode(true);;
    return cardTemplate;
  }

  //Метод добавления контента и поведения новой карточки
  createCard() {
    this._newCard = this._getTemplate();

    this._newCardImage = this._newCard.querySelector('.card__image');
    this._newCardImage.src = `./assets/${this._image}`;
    this._newCardImage.alt = `Фото ${this._lecturer}`;

    this._newCard.querySelector('.card__title').textContent = this._title;

    this._newCardTag = this._newCard.querySelector('.card__tag');
    this._newCardTag.textContent = this._tag;
    this._newCardTag.classList.add(`card__tag_${this._type}`)

    this._newCardData = this._newCard.querySelector('.card__data');
    this._newCardData.querySelector('.card__data_price').textContent = `$${this._price}`;
    this._newCardData.querySelector('.card__data_lecturer').textContent = this._lecturer;
    
    return this._newCard;
  }
}