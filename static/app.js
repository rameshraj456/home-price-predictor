function getBathValue() {
  const uiBathrooms = document.getElementsByName("uiBathrooms");
  for (let i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) return parseInt(uiBathrooms[i].value);
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  const uiBHK = document.getElementsByName("uiBHK");
  for (let i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) return parseInt(uiBHK[i].value);
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  const sqft = document.getElementById("uiSqft").value;
  const bhk = getBHKValue();
  const bathrooms = getBathValue();
  const location = document.getElementById("uiLocations").value;
  const estPrice = document.getElementById("uiEstimatedPrice");

  const url = "https://realstate-price-predictor.onrender.com/predict_home_price"; // Flask endpoint

  const payload = {
    total_sqft: parseFloat(sqft),
    bhk: bhk,
    bath: bathrooms,
    location: location
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.estimated_price !== undefined) {
        estPrice.innerHTML = `<h2>${data.estimated_price.toFixed(2)} Lakh</h2>`;
      } else if (data.error) {
        estPrice.innerHTML = `<h2>Error: ${data.error}</h2>`;
      } else {
        estPrice.innerHTML = `<h2>Unexpected response from server</h2>`;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      estPrice.innerHTML = `<h2>Something went wrong!</h2>`;
    });
}

function onPageLoad() {
  console.log("Document loaded");

  const url = "https://realstate-price-predictor.onrender.com/get_location_names";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.locations) {
        const uiLocations = document.getElementById("uiLocations");
        $('#uiLocations').empty();
        for (let i = 0; i < data.locations.length; i++) {
          const opt = new Option(data.locations[i]);
          $('#uiLocations').append(opt);
        }
      }
    })
    .catch(error => {
      console.error("Error loading locations:", error);
    });
}

window.onload = onPageLoad;
