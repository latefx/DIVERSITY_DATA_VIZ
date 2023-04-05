const queryString = window.location.search.substr(1);
const storeNames = queryString.split(',').map(decodeURIComponent);
const chartCanvas = document.getElementById("compare-chart");

if (storeNames.length) {
  let savedData = localStorage.getItem("chartData");
  savedData = savedData ? JSON.parse(savedData) : {};

  const labels = savedData.labels || [];
  const datasets = savedData.datasets || [];

  let storesData = [];
  storeNames.forEach(storeName => {
    const storeIndex = labels.indexOf(storeName);
    if (storeIndex >= 0) {
      const storeDataset = datasets.map(dataset => dataset.data[storeIndex]);
      storesData.push({ storeName, data: storeDataset });
    }
  });

  const chartData = {
    labels: storesData.map(store => store.storeName),
    datasets: savedData.subCategories ? savedData.subCategories.map((category, index) => ({
      label: category,
      data: storesData.map(store => store.data[index]),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.2)`,
    })) : []
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
}
