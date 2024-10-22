const url = "https://io.adafruit.com/api/v2/calderdigihub/feeds/course-plant-moisture/data/";

function getMean(dataArray) {
  let total = 0;
  let count = dataArray.length;
  for (const data of dataArray) {
    total += parseFloat(data);
  }

  return total / count;
}

function getArrays(moistureData) {
  let moisture = [];
  let unixTime = [];
  for (const element of moistureData) {
    moisture.push(parseFloat(element.value));
    unixTime.push(parseFloat(new Date(element.created_at).getTime()));
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

  return [slope, intercept];
}

function isMoistureOverTimeStable(moistureData) {
  let slope = moistureLinReg(moistureData)[0]
  if (slope <= 0.1 && slope >= -0.1) {
    return "Stable";
  }
  else if (slope < -0.1) {
    return "Negative";
  }
  else if (slope > 0.1) {
    return "Positive"
  }
  else return "Should not be returning this (something went wrong)"
}

fetch(url)
  .then(response => response.json())
  .then(data => {
    const latestMoisture = data[0].value;
    const dataTrend = isMoistureOverTimeStable(data)
    document.getElementById("moistureData").innerHTML = `<h2>Current Moisture: ${latestMoisture}</h2>`;
    document.getElementById("stability").innerHTML = `<h2>Trend: ${dataTrend}</h2>`
  })
  .catch(error => {
    document.getElementById("moistureData").innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
  });
