// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 2);

// Set up the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  noWrap: true,     
  bounds: [
    [-5, -170],
    [68, 180]
  ],         //this is the crucial line!
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var mapContainer = document.getElementById('map');
mapContainer.style.marginBottom = '20px'; 

const mapCountryDropdown = document.getElementById('countryDropdown');
mapCountryDropdown.addEventListener('change', mapPopulationDropdownChange);

const mapYearDropdown = document.getElementById('mapYearDropdown');
mapYearDropdown.addEventListener('change', mapPopulationDropdownChange);

// Function to populate the dropdown from an API
function populateDropdown() {
  fetch('http://127.0.0.1:5000/api/population')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      const mapCountryDropdown = document.getElementById('countryDropdown');
      
      // Sort country names alphabetically
      data.country.sort((a, b) => a.localeCompare(b));

      data.country.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        mapCountryDropdown.appendChild(option);
      });

      // Add event listener for country dropdown change
      mapCountryDropdown.addEventListener('change', mapPopulationDropdownChange);

      // Trigger initial mapPopulationDropdownChange to populate the map on page load
      mapPopulationDropdownChange();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
function mapPopulationDropdownChange () {
  const selectedCountryValue = mapCountryDropdown.value;
  const selectedYearValue = mapYearDropdown.value;
  fetch(`/api/population_of_single_country?country=${selectedCountryValue}&year=${selectedYearValue}`)
  .then(response => response.json())
  .then(data => {
    console.log('Received population data:', data);
const population_data = data.population_data[0];
const { latitude, longitude, country, totalpopjan_thousands } = population_data;
    const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<b>${country}</b><br>Population: ${totalpopjan_thousands}`);
    // alert (data.gpd_data_data[0].gdp)
    // Handle the received data here
  })
  .catch(error => {
    console.error('Error fetching population data:', error);
  });

}
// Call the function to populate the dropdown
populateDropdown();

// Function to populate the dropdown with years
function populateYears() {
  // Start year and end year
  const startYear = 1960;
  const endYear = 2023;

  // Loop through the range of years and create option elements
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    mapYearDropdown.appendChild(option);
  }
}

// Call the function to populate the dropdown
populateYears();


