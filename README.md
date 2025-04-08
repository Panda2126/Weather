# Weather Dashboard

A simple weather dashboard application that allows users to search for weather information by location, save favorite locations, and view a 5-day forecast.

## Features

- Search for weather by city name
- View current weather conditions including temperature, humidity, wind speed, and more
- See a 5-day forecast
- Save favorite locations for quick access
- Responsive design that works on desktop and mobile

## How to Use

1. Open `index.html` in a web browser
2. Enter a city name in the search box and click "Search" or press Enter
3. View the current weather and forecast
4. Click "Save Location" to add the city to your favorites
5. Click on any saved location to quickly view its weather
6. Delete saved locations with the "Delete" button

## Getting an API Key

This application uses the OpenWeatherMap API. To use it:

1. Sign up for a free account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. After signing up, go to your API keys section
3. Copy your API key
4. Open `app.js` and replace the empty string in `const API_KEY = '';` with your API key

## Technical Details

This application demonstrates several important concepts:

- **Third-party API Integration**: Using the OpenWeatherMap API
- **Caching Strategies**: Weather data is cached for 30 minutes to reduce API calls
- **Local Storage**: Saved locations are stored in the browser's localStorage
- **Error Handling**: Proper error handling for API requests
- **Responsive Design**: Works on different screen sizes

## Files in this Project

- `index.html` - The main HTML file
- `styles.css` - CSS styles for the application
- `app.js` - JavaScript that handles the application logic and API calls
- `README.md` - This documentation file

## For Beginners

If you're new to coding, here are some things to learn from this project:

1. **HTML Structure**: See how the page is organized in `index.html`
2. **CSS Styling**: Look at how the app is styled in `styles.css`
3. **JavaScript Functions**: Explore different functions in `app.js` that handle specific tasks
4. **API Integration**: Learn how to fetch data from external APIs
5. **Event Handling**: See how user interactions like clicks are handled
6. **Data Storage**: Learn about localStorage for saving user preferences 