const url = "https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data/";

function getMean(dataArray) {
  let total = 0;
  let count = dataArray.length;
  for (let data in dataArray) {
    total += data;
  }

  return total / count;
}

function getArrays(moistureData) {
  let moisture = [];
  let unixTime = [];
  for (const element of moistureData) {
    moisture.push(element.value);
    unixTime.push(element.created_at);
  };

  return [moisture, unixTime];
}

function moistureLinReg(moistureData) {
  let moisture = getArrays(moistureData)[0];
  let unixTime = getArrays(moistureData)[1];
  let avgMoisture = getMean(moisture);
  let avgUnixTime = getMean(unixTime);

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < moisture.length; i++) {
    numerator += ((unixTime[i] - avgUnixTime) * (moisture[i] - avgMoisture));
    denominator += (unixTime[i] - avgUnixTime) ** 2;
  };

  let slope = numerator / denominator;
  let intercept = avgMoisture - (slope * avgUnixTime);

  return { slope, intercept };
}

fetch(url)
  .then(response => response.json())
  .then(data => {
    const latestMoisture = data[0].value;
    document.getElementById("moistureData").innerHTML = `<h2>Current Moisture: ${latestMoisture}</h2>`;
  })
  .catch(error => {
    document.getElementById("moistureData").innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
  });
