document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const cityInput = document.getElementById('cityInput');
  const resultContainer = document.getElementById('resultContainer');
  const forecastContainer = document.getElementById('forecastContainer');
  const historyButton = document.getElementById('historyButton');
  const historyList = document.getElementById('historyList');
  const apiKey = '6db11c25c8f8dba649f2bf2f81ec17fb';

  searchButton.addEventListener('click', handleSearch);
  historyButton.addEventListener('click', toggleHistory);

  async function handleSearch() {
    const cityName = cityInput.value.trim();
    if (cityName) {
      try {
        const weatherData = await getWeatherData(cityName);
        displayCurrentWeather(weatherData);
        const { lat, lon } = weatherData.coord;
        const forecastData = await getForecast(lat, lon);
        displayForecast(forecastData);
        saveToHistory(cityName);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch weather data. Please try again.');
      }
    } else {
      alert('Please enter a city name.');
    }
  }

  async function getWeatherData(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data not found.');
    }
    return response.json();
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
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Forecast data not found.');
    }
    return response.json();
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

  function toggleHistory() {
    historyList.classList.toggle('show');
    populateHistory();
  }

  function populateHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyList.innerHTML = '';
    if (searchHistory.length > 0) {
      searchHistory.forEach(city => {
        const listItem = document.createElement('div');
        listItem.textContent = city;
        listItem.classList.add('history-item');
        listItem.addEventListener('click', () => {
          getWeatherData(city);
          historyList.classList.remove('show');
        });
        historyList.appendChild(listItem);
      });
    } else {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'No search history available.';
      historyList.appendChild(emptyMessage);
    }
  }

  function saveToHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
});
