var form = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var weatherInfo = document.getElementById('weather-info');
var weatherEl = document.getElementById('weather');
var temperatureEl = document.getElementById('temperature');
var humidityEl = document.getElementById('humidity');
var windSpeedEl = document.getElementById('wind-speed');
var forecastElement = document.getElementById('forecast');
var city = document.getElementById('city');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  searchCity(cityName);
  localStorage.setItem("City", cityName);

  city.innerHTML = " "

  var cityLoc = localStorage.getItem("City");
  var button = document.createElement("button");
  var textNode = document.createTextNode(cityLoc);

  city.appendChild(textNode);

  button.addEventListener("click", function() {
    searchCity(cityLoc);
  });

});

function searchCity (cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=3fffc9c73357ea67188499b2d5865e2b`)
    .then(response => response.json())
    .then(data => { 

        // Logs the data pulled from the API
        console.log("Current Weather: ", data);

      // Retrieves specific data from the API and puts it into variables
      var icon = data.weather[0].icon
      var weather = `https://openweathermap.org/img/wn/${icon}@2x.png`; // links to the openweathermap icons
      var temperature = data.main.temp;
      var humidity = data.main.humidity;
      var windSpeed = data.wind.speed;
      
      // Adds the retrieved data to the HTML element 
      weatherEl.src = `${weather}`;
      temperatureEl.textContent = `Temperature: ${temperature}°F`;
      humidityEl.textContent = `Humidity: ${humidity}%`;
      windSpeedEl.textContent = `Wind Speed: ${windSpeed} m/s`;

      // Displays weather info in a block
      weatherInfo.style.display = 'block';
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=3fffc9c73357ea67188499b2d5865e2b`)
    .then(response => response.json())
    .then(data => {

        // Logs the data pulled from the API
        console.log("Forecast: ", data);

      // Sets the data list as a variable
      var forecastData = data.list;
      
      // Erases the weather cards for the currently displayed city when a new city is searched
      forecastElement.innerHTML = '';

        // For loop that skips duplicate data(days)
        for (var i = 0; i < forecastData.length; i = i + 8){

        // Creates a new Date object using the value of forecastData[i].dt_txt, then stringifies it into MM/DD/YYYY
        var forecastDate = new Date(forecastData[i].dt_txt).toLocaleDateString('en-US', { weekday: 'long' })

        // Creates an array for each var
        var temp = forecastData[i].main.temp;
        var windSpeed = forecastData[i].wind.speed;
        var humidity = forecastData[i].main.humidity;
        var weatherIcon = forecastData[i].weather[0].icon
        var iconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  
        // Creates the cards for the 5 day forecast based on each array
        var forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
          <div class="card pink lighten-1 center-align">
            <div class="card-content white-text">
              <span class="card-title">${forecastDate}</span>
              <img src="${iconURL}"></img>
              <p>Temperature: ${temp}°F</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
          </div>
        `;
  
        // Appends the data to the HTML
        forecastElement.appendChild(forecastCard);
      };
    })
    .catch(error => {
      console.error('Error:', error);
    });
    };



    async function getDadJoke() {
      try {
        // Fetch joke
        const jokeResponse = await fetch('https://icanhazdadjoke.com/', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DadJokeViewer'
          }
        });
        const jokeData = await jokeResponse.json();
        const jokeText = jokeData.joke;
    
        // Find where question mark is
        const questionMarkIndex = jokeText.indexOf('?');
    
        // text before the question mark
        const setup = jokeText.substring(0, questionMarkIndex + 1).trim();
    
        // text after the question mark
        const punchline = jokeText.substring(questionMarkIndex + 1).trim();
    
        if (!setup || !punchline || !setup.includes('?')) {
          // If it's not a question, fetch another joke
          return getDadJoke();
        }
    
        // Display the setup on the front of the flash card
        document.getElementById('front').textContent = setup;
    
        // Display the punchline on the back of the flash card (initially hidden)
        document.getElementById('back').textContent = punchline;
      } catch (error) {
        console.error('Error fetching dad joke:', error);
      }
    }
    
    function toggleFlashCard() {
      // Toggle the display of front and back
      const frontElement = document.getElementById('front');
      const backElement = document.getElementById('back');
    
      if (backElement.style.display === 'none') {
        frontElement.style.display = 'none';
        backElement.style.display = 'block';
      } else {
        frontElement.style.display = 'block';
        backElement.style.display = 'none';
      }
    }
    
    function getNextJoke() {
      // Fetch a new joke when the "Next Joke" button is clicked
      getDadJoke();
    
      // Ensure the flash card is set to display the front
      document.getElementById('front').style.display = 'block';
      document.getElementById('back').style.display = 'none';
    }
    
    getDadJoke();
