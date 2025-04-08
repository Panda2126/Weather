// Constants
const API_KEY = 'b6fd97e651233bbee5f9d54a2c188503'; // Your OpenWeatherMap API key
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const saveLocationBtn = document.getElementById('save-location-btn');
const weatherInfo = document.getElementById('weather-info');
const forecastCards = document.getElementById('forecast-cards');
const savedLocationsList = document.getElementById('saved-locations-list');

// Storage key for saved locations
const SAVED_LOCATIONS_KEY = 'weatherApp_savedLocations';

// Cache object for storing weather data
const weatherCache = {};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load saved locations from localStorage
    loadSavedLocations();
    
    // Add event listeners
    searchBtn.addEventListener('click', handleSearch);
    saveLocationBtn.addEventListener('click', saveCurrentLocation);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// Handle search functionality
async function handleSearch() {
    const location = locationInput.value.trim();
    
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    try {
        // Show loading state
        weatherInfo.innerHTML = '<p>Loading weather data...</p>';
        forecastCards.innerHTML = '';
        
        // Get current weather and forecast data
        const currentWeather = await getWeatherData(location);
        const forecast = await getForecastData(location);
        
        // Display weather information
        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
    } catch (error) {
        weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
        forecastCards.innerHTML = '';
    }
}

// Get current weather data from API or cache
async function getWeatherData(location) {
    const cacheKey = `weather_${location.toLowerCase()}`;
    
    // Check if we have cached data that's still valid
    if (weatherCache[cacheKey] && 
        weatherCache[cacheKey].timestamp > Date.now() - CACHE_DURATION) {
        console.log('Using cached weather data');
        return weatherCache[cacheKey].data;
    }
    
    // If no valid cache, fetch from API
    console.log('Fetching fresh weather data');
    console.log('API Key being used:', API_KEY);
    
    if (!API_KEY) {
        throw new Error('Please add your OpenWeatherMap API key to the API_KEY constant');
    }
    
    const apiUrl = `${WEATHER_API_BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`;
    console.log('Making request to:', apiUrl);
    
    try {
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Location not found. Please try another city name.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid or not activated yet. It may take a few hours for a new key to activate.');
            }
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Save to cache
        weatherCache[cacheKey] = {
            timestamp: Date.now(),
            data: data
        };
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Get forecast data from API or cache
async function getForecastData(location) {
    const cacheKey = `forecast_${location.toLowerCase()}`;
    
    // Check if we have cached data that's still valid
    if (weatherCache[cacheKey] && 
        weatherCache[cacheKey].timestamp > Date.now() - CACHE_DURATION) {
        console.log('Using cached forecast data');
        return weatherCache[cacheKey].data;
    }
    
    // If no valid cache, fetch from API
    console.log('Fetching fresh forecast data');
    
    if (!API_KEY) {
        throw new Error('Please add your OpenWeatherMap API key to the API_KEY constant');
    }
    
    const apiUrl = `${WEATHER_API_BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`;
    console.log('Making forecast request to:', apiUrl);
    
    try {
        const response = await fetch(apiUrl);
        console.log('Forecast response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Location not found. Please try another city name.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid or not activated yet. It may take a few hours for a new key to activate.');
            }
            throw new Error('Failed to fetch forecast data');
        }
        
        const data = await response.json();
        
        // Save to cache
        weatherCache[cacheKey] = {
            timestamp: Date.now(),
            data: data
        };
        
        return data;
    } catch (error) {
        console.error('Forecast fetch error:', error);
        throw error;
    }
}

// Display current weather information
function displayCurrentWeather(weatherData) {
    const { name, main, weather, wind, sys } = weatherData;
    
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    
    weatherInfo.innerHTML = `
        <div class="location-info">
            <h3>${name}, ${sys.country}</h3>
            <div class="weather-main">
                <img src="${weatherIcon}" alt="${weather[0].description}">
                <span class="temperature">${temperature}°C</span>
            </div>
            <p class="weather-description">${weather[0].description}</p>
        </div>
        <div class="weather-details">
            <p><strong>Feels like:</strong> ${feelsLike}°C</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind:</strong> ${Math.round(wind.speed * 3.6)} km/h</p>
            <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(forecastData) {
    forecastCards.innerHTML = '';
    
    // Group forecast data by day
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Only take the first forecast entry for each day
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = item;
        }
    });
    
    // Create forecast cards (limit to 5 days)
    const days = Object.keys(dailyForecasts).slice(0, 5);
    
    days.forEach(day => {
        const forecast = dailyForecasts[day];
        const date = new Date(forecast.dt * 1000);
        const icon = forecast.weather[0].icon;
        const temp = Math.round(forecast.main.temp);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h3>${day}</h3>
            <p>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].description}">
            <p class="forecast-temp">${temp}°C</p>
            <p>${forecast.weather[0].description}</p>
        `;
        
        forecastCards.appendChild(card);
    });
}

// Save the current location
function saveCurrentLocation() {
    const location = locationInput.value.trim();
    
    if (!location) {
        alert('Please enter a location to save');
        return;
    }
    
    // Get existing saved locations
    const savedLocations = getSavedLocations();
    
    // Check if location already exists
    if (savedLocations.includes(location)) {
        alert('This location is already saved');
        return;
    }
    
    // Add new location
    savedLocations.push(location);
    
    // Save to localStorage
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
    
    // Update the UI
    loadSavedLocations();
}

// Get saved locations from localStorage
function getSavedLocations() {
    const savedLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);
    return savedLocations ? JSON.parse(savedLocations) : [];
}

// Load and display saved locations
function loadSavedLocations() {
    const savedLocations = getSavedLocations();
    
    // Clear existing list
    savedLocationsList.innerHTML = '';
    
    if (savedLocations.length === 0) {
        savedLocationsList.innerHTML = '<li>No saved locations yet</li>';
        return;
    }
    
    // Create list items for each saved location
    savedLocations.forEach(location => {
        const li = document.createElement('li');
        
        // Create location name element
        const locationName = document.createElement('span');
        locationName.textContent = location;
        locationName.addEventListener('click', () => {
            locationInput.value = location;
            handleSearch();
        });
        
        // Create delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'location-delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteLocation(location);
        });
        
        // Add elements to list item
        li.appendChild(locationName);
        li.appendChild(deleteBtn);
        savedLocationsList.appendChild(li);
    });
}

// Delete a saved location
function deleteLocation(locationToDelete) {
    let savedLocations = getSavedLocations();
    
    // Filter out the location to delete
    savedLocations = savedLocations.filter(location => location !== locationToDelete);
    
    // Save updated list
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
    
    // Update the UI
    loadSavedLocations();
}