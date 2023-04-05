const mainContainer = document.getElementById("main-container");
const storeContainer = document.getElementById("store-container");
const addStoreBtn = document.getElementById("add-store");
const chartCanvas = document.getElementById("chart");
const showImportModalBtn = document.getElementById("show-import-modal");
const importDataInput = document.getElementById("import-data");

const subCategories = [
  "Skin Tone",
  "Sizing",
  "Mannequin Diversity",
  "Adaptability",
  "Marketing",
  "Co-Gender",
];

function getRandomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (100 - 60) + 60);
  const l = Math.floor(Math.random() * (90 - 60) + 60); // Changed from (80 - 40) to (90 - 60)
  return `hsl(${h}, ${s}%, ${l}%)`;
}

let chartData = {
  labels: [],
  datasets: subCategories.map((category) => ({
    label: category,
    data: [],
    backgroundColor: getRandomColor(),
  })),
};


const chart = new Chart(chartCanvas.getContext("2d"), {
  type: "bar",
  data: chartData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        responsive: true, // Add this line
        maintainAspectRatio: false, // Add this line
      },
    },
  },
});

addStoreBtn.addEventListener("click", () => {
  const storeName = document.getElementById("store-name").value;
  if (storeName) {
    addStore(storeName);
    saveData();
    document.getElementById("store-name").value = "";
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

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-store");
  removeBtn.textContent = "x";
  removeBtn.addEventListener("click", () => {
    storeContainer.removeChild(storeDiv);
    removeStore(name);
  });
  storeDiv.appendChild(removeBtn);

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

function exportData() {
  let csvContent = "data:text/csv;charset=utf-8,Store," + subCategories.join(",") + "\n";

  chartData.labels.forEach((label, index) => {
    const rowData = [label].concat(chartData.datasets.map(dataset => dataset.data[index])).join(",");
    csvContent += rowData + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "chart_data.csv");
  document.body.appendChild(link);

  link.click();
}

document.getElementById("export-data").addEventListener("click", exportData);

function removeStore(name) {
  const storeIndex = chartData.labels.indexOf(name);
  if (storeIndex > -1) {
    chartData.labels.splice(storeIndex, 1);
    chartData.datasets.forEach((dataset) => {
      dataset.data.splice(storeIndex, 1);
    });
    chart.update();
    saveData();
  }
}

function showSummary() {
  let totalCountPerCategory = new Array(subCategories.length).fill(0);
  let totalYesPerCategory = new Array(subCategories.length).fill(0);

  chartData.labels.forEach((label, labelIndex) => {
    chartData.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.data[labelIndex] === 1) {
        totalYesPerCategory[datasetIndex]++;
      }
      totalCountPerCategory[datasetIndex]++;
    });
  });

  let summaryArray = [];
  subCategories.forEach((category, index) => {
    const percentage = ((totalYesPerCategory[index] / totalCountPerCategory[index]) * 100).toFixed(2);
    summaryArray.push({
      category,
      percentage
    });
  });

  let summaryText = "";
  summaryArray.forEach(({ category, percentage }) => {
    summaryText += `${category} diversity: ${percentage}% of stores\n`;
  });

  alert(summaryText);
}

document.getElementById("summary").addEventListener("click", showSummary);

function toggleMode() {
  document.body.classList.toggle("light-mode");
}

document.getElementById("toggle-mode").addEventListener("click", toggleMode);

function updateArrowDirection() {
  const arrowContainer = document.getElementById("arrow-container");
  if (window.scrollY > 0) {
    arrowContainer.style.flexDirection = "column-reverse";
  } else {
    arrowContainer.style.flexDirection = "column";
  }
}

window.addEventListener("scroll", updateArrowDirection);

// Start in Light Mode
document.body.classList.add("light-mode");

// Set the arrow direction correctly at the beginning
updateArrowDirection();
