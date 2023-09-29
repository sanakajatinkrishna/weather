document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('locationInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const unitToggle = document.getElementById('unitToggle');
    const weatherCard = document.querySelector('.weather-card');
    const weeklyWeather = document.querySelector('.weekly-weather');
    const hourlyWeather = document.querySelector('.hourly-weather');
    const body = document.body;

    const API_KEY = '4a1273a9d3msh4fdc54cd2d89231p18a7eejsnd30dcb1c254a';

    async function getWeather(location, units = 'metric') {
        try {
            const apiUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}&units=${units}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                    'X-RapidAPI-Key': API_KEY,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const temperature = data.current.temp_c;
                const humidity = data.current.humidity;
                const weatherDescription = data.current.condition.text;

                const weatherHTML = `
                    <h2>Current Weather</h2>
                    <p>Temperature: ${temperature}°${units === 'metric' ? 'C' : 'F'}</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Weather: ${weatherDescription}</p>
                `;

                weatherCard.innerHTML = weatherHTML;
                changeBackgroundImage(weatherDescription);
            } else {
                throw new Error(data.error.message || 'Weather data not available.');
            }
        } catch (error) {
            console.error(error);
            weatherCard.innerHTML = '<h2>Error fetching weather data</h2>';
        }
    }

    async function getWeeklyWeather(location, units = 'metric') {
        try {
            const apiUrl = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&units=${units}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                    'X-RapidAPI-Key': API_KEY,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const dailyForecasts = data.forecast.forecastday;

                const weeklyHTML = dailyForecasts.map((day) => `
                    <div class="day">
                        <h3>${day.date}</h3>
                        <p>Max Temp: ${day.day.maxtemp_c}°${units === 'metric' ? 'C' : 'F'}</p>
                        <p>Min Temp: ${day.day.mintemp_c}°${units === 'metric' ? 'C' : 'F'}</p>
                        <p>Weather: ${day.day.condition.text}</p>
                    </div>
                `).join('');

                weeklyWeather.innerHTML = weeklyHTML;
            } else {
                throw new Error(data.error.message || 'Weather data not available.');
            }
        } catch (error) {
            console.error(error);
            weeklyWeather.innerHTML = '<h2>Error fetching weekly weather data</h2>';
        }
    }

    async function getHourlyWeather(location, units = 'metric') {
        try {
            const apiUrl = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&units=${units}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                    'X-RapidAPI-Key': API_KEY,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const hourlyForecasts = data.forecast.forecastday[0].hour;

                const hourlyHTML = hourlyForecasts.map((hour) => `
                    <div class="hour">
                        <h3>${hour.time}</h3>
                        <p>Temperature: ${hour.temp_c}°${units === 'metric' ? 'C' : 'F'}</p>
                        <p>Weather: ${hour.condition.text}</p>
                    </div>
                `).join('');

                hourlyWeather.innerHTML = hourlyHTML;
            } else {
                throw new Error(data.error.message || 'Weather data not available.');
            }
        } catch (error) {
            console.error(error);
            hourlyWeather.innerHTML = '<h2>Error fetching hourly weather data</h2>';
        }
    }

    function changeBackgroundImage(weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes('rain') || description.includes('drizzle')) {
            body.style.backgroundImage = "url('rainy-background.jpg')";
            // You can add rain animations here
        } else if (description.includes('cloud')) {
            body.style.backgroundImage = "url('cloudy-background.jpg')";
        } else if (description.includes('sun') || description.includes('clear')) {
            body.style.backgroundImage = "url('sunny-background.jpg')";
        } else {
            body.style.backgroundImage = "url('default-background.jpg')";
        }
    }

    getWeatherBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        const units = unitToggle.value;

        if (location) {
            weatherCard.innerHTML = '<h2>Loading...</h2>';
            weeklyWeather.innerHTML = '';
            hourlyWeather.innerHTML = '';
            getWeather(location, units);
            getWeeklyWeather(location, units);
            getHourlyWeather(location, units);
        }
    });

    // Initial background image (default)
    body.style.backgroundImage = "url('default-background.jpg')";
});
