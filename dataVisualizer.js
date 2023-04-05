const mainContainer = document.getElementById("main-container");
const storeContainer = document.getElementById("store-container");
const addStoreBtn = document.getElementById("add-store");
const chartCanvas = document.getElementById("chart");
const showImportModalBtn = document.getElementById("show-import-modal");
const importDataInput = document.getElementById("import-data");
const showSummaryBtn = document.getElementById("show-summary");
const storeNameInput = document.getElementById("store-name");

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
  const storeName = storeNameInput.value;
  if (storeName) {
    addStore(storeName);
    saveData();
    storeNameInput.value = "";
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

    const title = document.createElement("span");
    title.textContent = category;
    subCategoryDiv.appendChild(title);

    const select = document.createElement("select");
    select.innerHTML = `
      <option value="0">No</option>
      <option value="1">Yes</option>
    `;
    select.addEventListener("change", () => {
      chartData.datasets[newIndex].data[
        chartData.labels.indexOf(name)
      ] = parseInt(select.value);
      chart.update();
      saveData();
    });
    subCategoryDiv.appendChild(select);
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
  if (confirm("Are you sure you want to delete your data?")) {
    localStorage.removeItem("chartData");
    location.reload();
  }
}

document.getElementById("clear-data").addEventListener("click", clearData);

showSummaryBtn.addEventListener("click", () => {
  const summary = subCategories.map((category, index) => {
    const totalYes = chartData.datasets[index].data.reduce((total, value) => total + (value === 1 ? 1 : 0), 0);
    const percentage = (totalYes / chartData.labels.length) * 100;
    return `${category}: ${percentage.toFixed(2)}% stores have this feature`;
  }).join("\n");
  alert(summary);
});
