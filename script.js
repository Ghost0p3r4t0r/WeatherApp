class WeatherApp {
    constructor() {
        this.apiKey = 96c63bb1c67aaf3484b715803e8fdef6; // Replace with your OpenWeatherMap API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDateTime();
        this.loadDefaultWeather();
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        const locationBtn = document.getElementById('locationBtn');

        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        locationBtn.addEventListener('click', () => this.getCurrentLocation());
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    }

    async loadDefaultWeather() {
        // Try to get user's location first, otherwise default to London
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    this.getWeatherByCity('London');
                }
            );
        } else {
            this.getWeatherByCity('London');
        }
    }

    async searchWeather() {
        const city = document.getElementById('cityInput').value.trim();
        if (!city) return;
        
        await this.getWeatherByCity(city);
        document.getElementById('cityInput').value = '';
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                this.showError('Unable to retrieve your location.');
            }
        );
    }

    async getWeatherByCity(city) {
        this.showLoading();
        
        // Since we can't use real API in this demo, we'll simulate the response
        setTimeout(() => {
            this.simulateWeatherData(city);
        }, 1500);
    }

    async getWeatherByCoords(lat, lon) {
        this.showLoading();
        
        // Since we can't use real API in this demo, we'll simulate the response
        setTimeout(() => {
            this.simulateWeatherData('Your Location');
        }, 1500);
    }

    // Simulate weather data for demo purposes
    simulateWeatherData(city) {
        const weatherConditions = [
            { 
                condition: 'sunny', 
                icon: 'fas fa-sun', 
                temp: Math.floor(Math.random() * 15) + 20,
                desc: 'Clear Sky',
                humidity: Math.floor(Math.random() * 30) + 40,
                windSpeed: Math.floor(Math.random() * 10) + 5,
                visibility: Math.floor(Math.random() * 5) + 8,
                pressure: Math.floor(Math.random() * 50) + 1000
            },
            { 
                condition: 'partly-cloudy', 
                icon: 'fas fa-cloud-sun', 
                temp: Math.floor(Math.random() * 12) + 18,
                desc: 'Partly Cloudy',
                humidity: Math.floor(Math.random() * 20) + 50,
                windSpeed: Math.floor(Math.random() * 8) + 7,
                visibility: Math.floor(Math.random() * 3) + 6,
                pressure: Math.floor(Math.random() * 40) + 1005
            },
            { 
                condition: 'cloudy', 
                icon: 'fas fa-cloud', 
                temp: Math.floor(Math.random() * 10) + 15,
                desc: 'Cloudy',
                humidity: Math.floor(Math.random() * 25) + 60,
                windSpeed: Math.floor(Math.random() * 12) + 8,
                visibility: Math.floor(Math.random() * 4) + 5,
                pressure: Math.floor(Math.random() * 45) + 995
            },
            { 
                condition: 'rainy', 
                icon: 'fas fa-cloud-rain', 
                temp: Math.floor(Math.random() * 8) + 12,
                desc: 'Light Rain',
                humidity: Math.floor(Math.random() * 20) + 70,
                windSpeed: Math.floor(Math.random() * 15) + 10,
                visibility: Math.floor(Math.random() * 3) + 4,
                pressure: Math.floor(Math.random() * 30) + 990
            }
        ];

        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        const weatherData = {
            name: city,
            main: {
                temp: randomWeather.temp,
                feels_like: randomWeather.temp + Math.floor(Math.random() * 6) - 3,
                humidity: randomWeather.humidity,
                pressure: randomWeather.pressure
            },
            weather: [{
                main: randomWeather.desc,
                description: randomWeather.desc.toLowerCase(),
                icon: randomWeather.condition
            }],
            wind: {
                speed: randomWeather.windSpeed
            },
            visibility: randomWeather.visibility * 1000
        };

        this.displayWeather(weatherData);
        this.generateForecast(randomWeather);
    }

    displayWeather(data) {
        // Update city name
        document.getElementById('cityName').textContent = data.name;
        
        // Update temperature
        document.getElementById('temp').textContent = Math.round(data.main.temp);
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
        
        // Update weather description
        document.getElementById('description').textContent = data.weather[0].main;
        
        // Update weather icon
        const iconElement = document.getElementById('weatherIcon');
        iconElement.className = this.getWeatherIcon(data.weather[0].icon);
        
        // Update weather details
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind.speed} km/h`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        
        this.hideLoading();
        this.showWeatherContent();
    }

    generateForecast(currentWeather) {
        const forecastList = document.getElementById('forecastList');
        forecastList.innerHTML = '';
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        
        const weatherIcons = [
            'fas fa-sun',
            'fas fa-cloud-sun',
            'fas fa-cloud',
            'fas fa-cloud-rain',
            'fas fa-cloud-showers-heavy'
        ];
        
        for (let i = 1; i <= 5; i++) {
            const dayIndex = (today + i) % 7;
            const temp = currentWeather.temp + Math.floor(Math.random() * 10) - 5;
            const randomIcon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="day">${days[dayIndex]}</div>
                <div class="forecast-icon">
                    <i class="${randomIcon}"></i>
                </div>
                <div class="forecast-temp">${temp}°</div>
            `;
            
            forecastList.appendChild(forecastItem);
        }
    }

    getWeatherIcon(condition) {
        const iconMap = {
            'sunny': 'fas fa-sun',
            'partly-cloudy': 'fas fa-cloud-sun',
            'cloudy': 'fas fa-cloud',
            'rainy': 'fas fa-cloud-rain',
            'heavy-rain': 'fas fa-cloud-showers-heavy',
            'snow': 'fas fa-snowflake',
            'clear': 'fas fa-sun',
            'clouds': 'fas fa-cloud',
            'rain': 'fas fa-cloud-rain'
        };
        
        return iconMap[condition] || 'fas fa-sun';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('weatherContent').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showWeatherContent() {
        document.getElementById('weatherContent').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
    }

    showError(message) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'flex';
        document.getElementById('errorMessage').querySelector('p').textContent = message;
    }
}

// Enhanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the weather app
    new WeatherApp();
    
    // Add dynamic background effects
    createParticles();
    
    // Add hover effects for interactive elements
    addInteractiveEffects();
});

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(particle);
}

function addInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .weather-card {
        animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .forecast-item {
        animation: fadeInScale 0.6s ease-out forwards;
        opacity: 0;
        transform: scale(0.8);
    }
    
    .forecast-item:nth-child(1) { animation-delay: 0.1s; }
    .forecast-item:nth-child(2) { animation-delay: 0.2s; }
    .forecast-item:nth-child(3) { animation-delay: 0.3s; }
    .forecast-item:nth-child(4) { animation-delay: 0.4s; }
    .forecast-item:nth-child(5) { animation-delay: 0.5s; }
    
    @keyframes fadeInScale {
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .detail-item {
        animation: slideInLeft 0.6s ease-out forwards;
        opacity: 0;
        transform: translateX(-30px);
    }
    
    .detail-item:nth-child(1) { animation-delay: 0.1s; }
    .detail-item:nth-child(2) { animation-delay: 0.2s; }
    .detail-item:nth-child(3) { animation-delay: 0.3s; }
    .detail-item:nth-child(4) { animation-delay: 0.4s; }
    
    @keyframes slideInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);