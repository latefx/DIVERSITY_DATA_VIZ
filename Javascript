document.getElementById("add-store").addEventListener("click", addStore);
document.getElementById("load-data").addEventListener("click", loadData);
document.getElementById("clear-data").addEventListener("click", clearData);

const subcategories = ["Skin Tone", "Sizing", "Mannequin Diversity", "Adaptability", "Marketing", "Co-Gender"];

function addStore() {
  const storeName = document.getElementById("store-name").value;

  if (!storeName) return;

  const storeContainer = document.createElement("div");
  storeContainer.classList.add("store");

  const storeTitle = document.createElement("h2");
  storeTitle.innerHTML = storeName;

  storeContainer.appendChild(storeTitle);

  subcategories.forEach((subcategory) => {
    const subcategoryDiv = document.createElement("div");
    subcategoryDiv.classList.add("subcategory");

    const subcategoryName = document.createElement("p");
    subcategoryName.innerHTML = subcategory;

    const increaseButton = document.createElement("button");
    increaseButton.innerHTML = "+";
    increaseButton.addEventListener("click", () => {
      updateCounter(subcategoryDiv, 1);
    });

    const decreaseButton = document.createElement("button");
    decreaseButton.innerHTML = "-";
    decreaseButton.addEventListener("click", () => {
      updateCounter(subcategoryDiv, -1);
    });

    const counter = document.createElement("p");
    counter.innerHTML = "0";

    subcategoryDiv.appendChild(subcategoryName);
    subcategoryDiv.appendChild(increaseButton);
    subcategoryDiv.appendChild(decreaseButton);
    subcategoryDiv.appendChild(counter);

    storeContainer.appendChild(subcategoryDiv);
  });

  document.getElementById("store-name").value = "";
  document.getElementById("store-container").appendChild(storeContainer);
}

function updateCounter(element, value) {
  const counter = element.querySelector("p:last-of-type");
  let count = parseInt(counter.innerHTML);
  count += value;
  if (count < 0) count = 0;
  counter.innerHTML = count;
}

let chart; // Added this line outside the loadData function.

function loadData() {
  let data = localStorage.getItem("dataVisualizerData");

  if (!data) return;

  data = JSON.parse(data);
  document.getElementById("store-container").innerHTML = "";
  data.forEach((store) => {
    const storeElem = addStore(store.name);
    store.tallies.forEach((tally, index) => {
      storeElem.querySelectorAll(".subcategory")[index].querySelector("p:last-of-type").innerHTML = tally;
    });
  });

  updateChart(); // Add this line at the end of loadData function.
}

function saveData() {
  const data = Array.from(document.querySelectorAll(".store")).map((store) => {
    const tallies = Array.from(store.querySelectorAll(".subcategory p:last-of-type")).map((p) => parseInt(p.innerHTML));
    return { name: store.querySelector("h2").innerHTML, tallies };
  });

  localStorage.setItem("dataVisualizerData", JSON.stringify(data));
}

function clearData() {
  if (confirm("Are you sure you want to clear all data?")) {
    localStorage.removeItem("dataVisualizerData");
    document.getElementById("store-container").innerHTML = "";
  }
}

window.addEventListener("beforeunload", saveData);
