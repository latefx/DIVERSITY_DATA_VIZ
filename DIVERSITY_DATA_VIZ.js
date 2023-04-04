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
      }
    });
    subCategoryDiv.appendChild(decrementBtn);
  });

  chart.data.labels = chartData.labels;
  chart.update();
}
