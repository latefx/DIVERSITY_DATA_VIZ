document.getElementById("add-store").addEventListener("click", addStore);
document.getElementById("load-data").addEventListener("click", loadData);
document.getElementById("clear-data").addEventListener("click", clearData);

const subcategories = ["Skin Tone", "Sizing", "Mannequin Diversity", "Adaptability", "Marketing", "Co-Gender"];

function addStore(storeName) {
  if (!storeName) {
    storeName = document.getElementById("store-name").value;
    if (!storeName) return;
    document.getElementById("store-name").value = "";
  }

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

  document.getElementById("store-container").appendChild(storeContainer);
}

function updateCounter(element, value) {
  const counter = element.querySelector("p:last-of-type");
  let count = parseInt(counter.innerHTML);
  count += value;
  if (count < 0) count = 0;
  counter.innerHTML = count;
}

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

  updateChart();
}

let chart;

function updateChart() {
  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById("chart").getContext("2d");

  // Prepare datasets
  const stores = document.querySelectorAll(".store");
  const datasets = [];

  subcategories.forEach((subcategory, index) => {
    const dataset = {
      label: subcategory,
      data: [],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ][index % 6],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ][index % 6],
      borderWidth: 1,
    };

    stores.forEach((store) => {
      const tallies = Array.from(store.querySelectorAll(".subcategory p:last-of-type")).map((p) => parseInt(p.innerHTML));
      dataset.data.push(tallies[index]);
    });

    datasets.push(dataset);
  });

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Array.from(document.querySelectorAll(".store h2")).map((el) => el.innerHTML),
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
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
