const mainContainer = document.getElementById("main-container");
const storeContainer = document.getElementById("store-container");
const addStoreBtn = document.getElementById("add-store");
const chartCanvas = document.getElementById("chart");

const subCategories = [
  "Skin Tone",
  "Sizing",
  "Mannequin Diversity",
  "Adaptability",
  "Marketing",
  "Co-Gender",
];

const chartData = {
  labels: [],
  datasets: subCategories.map((category) => ({
    label: category,
    data: [],
    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 0.2)`,
  })),
};

const chart = new Chart(chartCanvas.getContext("2d"), {
  type: "bar",
  data: chartData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

addStoreBtn.addEventListener("click", () => {
  const storeName = prompt("Enter store name:");
  if (storeName) {
    addStore(storeName);
    saveData();
  }
});

function addStore(name) {
  const storeDiv = document.createElement("div");
  storeDiv.classList.add("store");
  storeDiv.innerHTML = `<h3>${name}</h3>`;
  storeContainer.appendChild(storeDiv);

  chartData.labels.push(name);

  subCategories.forEach((category, index) => {
    const subCategoryDiv = document.createElement("div");
    subCategoryDiv.classList.add("subcategory");
    storeDiv.appendChild(subCategoryDiv);

    const count = document.createElement("span");
    count.textContent = "0";
    subCategoryDiv.appendChild(count);

    const title = document.createElement("span");
    title.textContent = category;
    subCategoryDiv.appendChild(title);

    const incrementBtn = document.createElement("button");
    incrementBtn.textContent = "+";
    incrementBtn.addEventListener("click", () => {
      count.textContent = parseInt(count.textContent) + 1;
      chartData.datasets[index].data[
        chartData.labels.indexOf(name)
      ] = parseInt(count.textContent);
      chart.update();
      saveData();
    });
    subCategoryDiv.appendChild(incrementBtn);

    const decrementBtn = document.createElement("button");
    decrementBtn.textContent = "-";
    decrementBtn.addEventListener("click", () => {
      if (parseInt(count.textContent) > 0) {
        count.textContent = parseInt(count.textContent) - 1;
        chartData.datasets[index].data[
          chartData.labels.indexOf(name)
        ] = parseInt(count.textContent);
        chart.update();
        saveData();
      }
    });
    subCategoryDiv.appendChild(decrementBtn);
  });

  chart.data.labels = chartData.labels;
  chart.update();
}

function saveData() {
  localStorage.setItem("chartData", JSON.stringify(chartData));
}

function loadData() {
  const loadedData = localStorage.getItem("chartData");

  if (loadedData) {
    const parsedData = JSON.parse(loadedData);
    chartData.labels = parsedData.labels;
    parsedData.datasets.forEach((dataset, index) => {
      chartData.datasets[index].data = dataset.data;
    });

    parsedData.labels.forEach((label) => addStore(label));
    chart.update();
  }
}

function clearData() {
  localStorage.removeItem("chartData");
  location.reload();
}

function exportData() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Store," + subCategories.join(",") + "\r\n";

  chartData.labels.forEach((label, index) => {
    const rowData = [label];
    chartData.datasets.forEach((dataset) => {
      rowData.push(dataset.data[index]);
    });

    csvContent += rowData.join(",") + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);

  link.click();
}

const loadBtn = document.getElementById("load-data");
const clearBtn = document.getElementById("clear-data");
const exportBtn = document.getElementById("export-data");

loadBtn.addEventListener("click", loadData);
clearBtn.addEventListener("click", clearData);
exportBtn.addEventListener("click", exportData);

loadData(); // Load data when the app starts
