const url = "https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data/";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const latestMoisture = data[0].value;
    document.getElementById("moistureData").innerHTML = `<h2>Current Moisture: ${latestMoisture}</h2>`;
  })
  .catch(error => {
    document.getElementById("moistureData").innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
  });
