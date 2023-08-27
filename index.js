import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-ecd8b-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, "shoppingLists");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const listItems = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListinDB, inputValue);

  console.log(`${inputValue} Added`);

  clearInputFieldEl();
});

onValue(shoppingListinDB, function (snapshot) {
  if (snapshot.exists()) {
    const itemsArray = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      clearInputFieldEl();
      appendItemtoShoppingListEl(currentItem);
    }
  } else {
    listItems.innerHTML = "Nothing needed right now!";
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemtoShoppingListEl(item) {
  const itemID = item[0];
  const itemValue = item[1];
  const newEl = document.createElement("li");
  newEl.textContent = itemValue;

  listItems.append(newEl);

  newEl.addEventListener("dblclick", function () {
    const databaseLocation = ref(database, `shoppingLists/${itemID}`);
    remove(databaseLocation);
  });
}

function clearShoppingList() {
  listItems.innerHTML = "";
}
