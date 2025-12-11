import { cardList } from "./constants.js";

//Имитация фетча данных
export async function getCards() {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve([...cardList]);
    }, Math.random() * 500 + 500);
  });
}
