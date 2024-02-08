document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const cityInput = document.getElementById('cityInput');
    const resultContainer = document.getElementById('resultContainer');
    const forecastContainer = document.getElementById('forecastContainer');
    const apiKey = '6db11c25c8f8dba649f2bf2f81ec17fb';
  
    searchButton.addEventListener('click', handleSearch);
  
    function handleSearch() {
      const cityName = cityInput.value.trim();
      if (cityName) {
        getWeatherData(cityName);
      } else {
        alert('Please enter a city name.');
      }
    }
  
    async function getWeatherData(cityName) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Weather data not found.');
        }
        const data = await response.json();
        displayCurrentWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
      }
    }
  
    function displayCurrentWeather(data) {
      const { name, main, weather, wind } = data;
      const temperature = main.temp;
      const description = weather[0].description;
      const humidity = main.humidity;
      const windSpeed = wind.speed;
  
      const currentWeatherHTML = `
        <h2>Current Weather in ${name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
  
      resultContainer.innerHTML = currentWeatherHTML;
    }
  
    async function getForecast(lat, lon) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Forecast data not found.');
        }
        const data = await response.json();
        displayForecast(data);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        alert('Failed to fetch forecast data. Please try again.');
      }
    }
  
    function displayForecast(data) {
      const forecastList = data.list;
      let forecastHTML = '<h2>5-Day Forecast</h2>';
  
      for (let i = 0; i < forecastList.length; i += 8) {
        const forecast = forecastList[i];
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const icon = forecast.weather[0].icon;
  
        forecastHTML += `
          <div class="forecast-card">
            <p>Date: ${date.toLocaleDateString()}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Description: ${description}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
          </div>
        `;
      }
  
      forecastContainer.innerHTML = forecastHTML;
    }
  });
  