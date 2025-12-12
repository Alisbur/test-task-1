import { filterList } from "./constants.js";
import { FilterButton } from "./FilterButton.js";
import { Card } from "./Card.js";
import { getCards } from "./getCards.js";

const filtersState = filterList.map((f) => ({ ...f, isActive: false }));

// const url = new URL(window.location);

const loader = document.querySelector(".loader");
const cards = document.querySelector(".cards");
const filters = document.querySelector(".filter-bar__buttons-slot");
const newCardTemplate = "#card-template-id";
const newFilterButtonTemplate = "#filter-button-template-id";
const loadMoreButton = document.querySelector(".more-button");
const searchButton = document.querySelector(".search__button");
const searchInput = document.querySelector(".search__input");
const nothingFound = document.querySelector(".nothing-found");

toggleLoader(true);
toggleNothingFound(false);
const allCards = await getCards();
toggleLoader(false);

loadMoreButton.addEventListener("click", handleLoadMore);
searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", handleInputEnterPress);

//Обработчик нажатия Enter в Input
function handleInputEnterPress(evt) {
  if (evt.key === "Enter") handleSearch();
}

//Возвращает строку из инпута
function getCurrentQuery() {
  return searchInput.value.toLowerCase();
}

function getCurrentFilter() {
  const activeFilter = filtersState.find((f) => f.isActive);
  return activeFilter ? activeFilter.type : "all";
}

//Подсчёт количества карточек конкретного типа
function getCardCountByType(type) {
  return type === "all"
    ? allCards.length
    : allCards.filter((card) => card.type === type).length;
}

//Включение отключение лоадера
function toggleLoader(newState = true) {
  if (newState) {
    loader.classList.remove("loader__animation_hidden");
  } else {
    loader.classList.add("loader__animation_hidden");
  }
}

//Включение отключение сообщения Ничего не найдено
function toggleNothingFound(newState = true) {
  if (newState) {
    nothingFound.style.display = "block";
  } else {
    nothingFound.style.display = "none";
  }
}

//Функция добавления карточки на страницу
function addCard(card) {
  cards.append(card);
}

//Функция создания вёрстки новой карточки
function createNewCard(card) {
  const newCard = new Card(card, newCardTemplate);
  const cardElement = newCard.createCard();
  return cardElement;
}

//Функция добавления кнопки фильтра на страницу
function addFilterButton(filterButton) {
  filters.append(filterButton);
}

//Функция создания вёрстки новой кнопки фильтра
function createNewFilterButton(filterData) {
  const newFilterButton = new FilterButton(
    filterData,
    getCardCountByType(filterData.type),
    newFilterButtonTemplate,
    handleSetFilter
  );
  const filterButton = newFilterButton.createFilterButton();
  return filterButton;
}

//Цикл добавления всех карточек из списка на страницу
function renderCards(cardsArr, replace = true) {
  if (replace) cards.replaceChildren();
  if (!cardsArr.length && replace) {
    toggleNothingFound(true);
    return;
  }
  toggleNothingFound(false);
  cardsArr.forEach((card) => {
    const newCard = createNewCard(card);
    addCard(newCard);
  });
}

//Цикл добавления кнопок фильтров на страницу
function renderFilters(filtersArr) {
  filters.replaceChildren();
  filtersArr.forEach((filter) => {
    const newFilterButton = createNewFilterButton(filter);
    addFilterButton(newFilterButton);
  });
}

//Функция добавления новых карточек
async function handleLoadMore() {
  toggleLoader(true);
  const cardsToAdd = await getCards();
  allCards.push(...cardsToAdd);
  const filteredCardsToAdd = filterCards(
    cardsToAdd,
    getCurrentFilter(),
    getCurrentQuery()
  );
  renderFilters(filtersState);
  renderCards(filteredCardsToAdd, false);
  toggleLoader(false);
}

//Функция фильтрации карточек
function filterCards(cardsArr, type, query = "") {

  //Функция проверки соответствия карточки поисковому запросу
  const isMatchingQuery = (c, q) => {
    const lowQ = q.toLowerCase();

    if (
      c.title.toLowerCase().includes(lowQ) ||
      c.tag.toLowerCase().includes(lowQ) ||
      c.lecturer.toLowerCase().includes(lowQ)
    )
      return true;
    return false;
  };

  const filteredCards =
    type !== "all" ? cardsArr.filter((c) => c.type === type) : [...cardsArr];

  setSearchParams(type, query);

  return query
    ? filteredCards.filter((c) => isMatchingQuery(c, query))
    : filteredCards;
}

//Обновление searchParams страницы
function setSearchParams(type, query) {
  const url = new URL(window.location);

  if (type && type !== "all") {
    url.searchParams.set("type", type);
  } else {
    url.searchParams.delete("type");
  }

  if (query) {
    url.searchParams.set("query", query);
  } else {
    url.searchParams.delete("query");
  }

  window.history.pushState({}, "", url);
}

//Получение searchParams из url
function parseSearchParams() {
  const url = new URL(window.location);

  if (url.searchParams.size) {
    const t = url.searchParams.get("type");
    const q = url.searchParams.get("query");

    if (t) {
      handleSetFilter(t);
    } else {
      handleSetFilter("all");
    }

    if (q) {
      searchInput.value = q;
      handleSearch();
    }
  } else {
    handleSetFilter("all");
  }
}

//Включение фильтра
function handleSetFilter(type) {
  for (let f of filtersState) {
    if (f.type === type) {
      f.isActive = true;
    } else {
      f.isActive = false;
    }
  }
  renderFilters(filtersState);
  const filteredCards = filterCards(allCards, type, getCurrentQuery());
  renderCards(filteredCards);
}

//Поиск по поисковому запросу
function handleSearch() {
  const searchQuery = getCurrentQuery();

  const filteredCards = searchQuery
    ? filterCards(allCards, getCurrentFilter(), searchQuery)
    : filterCards(allCards, getCurrentFilter());
  renderCards(filteredCards);
}

parseSearchParams();

