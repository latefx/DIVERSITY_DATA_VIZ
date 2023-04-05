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

  const yesData = storesData.map(store => store.data.reduce((count, val) => (val === 1 ? count + 1 : count), 0));
  const noData = storesData.map(store => store.data.reduce((count, val) => (val === 0 ? count + 1 : count), 0));

  const chartData = {
    labels: storesData.map(store => store.storeName),
    datasets: [
      {
        label: "Yes",
        data: yesData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      },
      {
        label: "No",
        data: noData,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
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
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Store Comparison"
        }
      }
    },
  });
}
