const mainContainer = document.getElementById("main-container");
const storeContainer = document.getElementById("store-container");
const addStoreBtn = document.getElementById("add-store");
const chartCanvas = document.getElementById("chart");
const showImportModalBtn = document.getElementById("show-import-modal");
const importDataInput = document.getElementById("import-data");
const chartTypeSelector = document.getElementById("chart-type");

const subCategories = [
  "Skin Tone",
  "Sizing",
  "Mannequin Diversity",
  "Adaptability",
  "Marketing",
  "Co-Gender",
];

let chartData = {
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

showImportModalBtn.addEventListener("click", () => {
  importDataInput.click();
});

importDataInput.addEventListener("change", () => {
  const file = importDataInput.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const lines = event.target.result.split("\n");
    if (lines.length) {
      const header = lines[0].split(",");

      if (header.length - 1 !== subCategories.length || header[0] !== "Store") {
        alert("Invalid CSV format. Please use the correct template.");
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        if (data.length === header.length) {
          addStore(data[0]);

          for (let j = 1; j < data.length; j++) {
            chartData.datasets[j - 1].data[
              chartData.labels.indexOf(data[0])
            ] = parseInt(data[j]);
          }
        }
      }

      chart.update();
      saveData();
    }
  };
  fileReader.readAsText(file);
});

chartTypeSelector.addEventListener("change", () => {
  const newChartType =(chartTypeSelector.value);
  chart.config.type = newChartType;
  chart.update();
});

function addStore(name) {
  const storeDiv = document.createElement("div");
  storeDiv.classList.add("store");
  storeDiv.innerHTML = `<h3>${name}</h3>`;
  storeContainer.appendChild(storeDiv);

  chartData.labels.push(name);

  subCategories.forEach((category, newIndex) => {
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
      chartData.datasets[newIndex].data[
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
        chartData.datasets[newIndex].data[
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
  localStorage.setItem("chartData", JSON.stringify({
    labels: chartData.labels,
    datasets: chart.data.datasets,
    subCategories: chart.data.datasets.map(dataset => dataset.label)
  }));
}

function loadData() {
  let savedData = localStorage.getItem("chartData");
  savedData = savedData ? JSON.parse(savedData) : {};

  chartData.labels = savedData.labels || [];
  chartData.datasets = savedData.datasets || [];

  if (savedData.subCategories) {
    subCategories.length = 0;
    Array.prototype.push.apply(subCategories, savedData.subCategories);
  }

  chartData.labels.forEach((label) => {
    addStore(label);
  });

  chart.data = chartData;
  chart.update();
}

function clearData() {
  localStorage.removeItem("chartData");
  location.reload();
}

document.getElementById("load-data").addEventListener("click", loadData);
document.getElementById("clear-data").addEventListener("click", clearData);
