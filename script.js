const temperature = document.getElementById('temperature');
const progressBarFill = document.getElementById('progress-bar-fill');
const heatButton = document.getElementById('heatButton');
const status = document.getElementById('status');
const iceImage = document.getElementById('iceImage');
const timerDisplay = document.getElementById('timer');

// Graph Elements
const toggleGraphBtn = document.getElementById('toggleGraphBtn');
const graphContainer = document.getElementById('graphContainer');
const ctx = document.getElementById('tempChart').getContext('2d');

let currentTemp = -20;
let isHeating = false;
let startTime;
let timerInterval;
let meltingEnergy = 0;
let boilingEnergy = 0;
let currentState = 0;
let heatingInterval;
let totalSeconds = 0; // Track exact seconds for the graph X-axis

// Phase change constants
const MELTING_POINT = 0;
const BOILING_POINT = 100;
const ENERGY_NEEDED_TO_MELT = 150;
const ENERGY_NEEDED_TO_BOIL = 250;

const states = [
    { temp: -19.9, image: 'https://doormat1.github.io/heating_images/solid_heating.gif', status: 'Frozen ice cube' },
    { temp: 0, image: 'https://doormat1.github.io/heating_images/Melting.gif', status: 'Ice melting (0°C)' },
    { temp: 0.1, image: 'heating_images/Heating_water.gif', status: 'Liquid water heating up' },
    { temp: 100, image: 'https://doormat1.github.io/heating_images/Boiling.gif', status: 'Water boiling (100°C)' },
    { temp: 100.1, image: 'https://doormat1.github.io/heating_images/Steam_new.gif', status: 'Water has evaporated, now heating the steam' }
];

// --- CHART SETUP ---
const tempChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Time goes here
        datasets: [{
            label: 'Temperature (°C)',
            data: [], // Temp goes here
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointRadius: 0 // Hides individual dots for a smoother line
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time (seconds)' } },
            y: { title: { display: true, text: 'Temperature (°C)' }, min: -30, max: 120 }
        },
        animation: false // Disable animation for performance during live updates
    }
});

// --- TOGGLE BUTTON LOGIC ---
toggleGraphBtn.addEventListener('click', () => {
    if (graphContainer.style.display === 'none' || graphContainer.style.display === '') {
        graphContainer.style.display = 'block';
        toggleGraphBtn.textContent = 'Hide Graph';
    } else {
        graphContainer.style.display = 'none';
        toggleGraphBtn.textContent = 'Show Graph';
    }
});

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateIceImage() {
    for (let i = states.length - 1; i >= 0; i--) {
        if (currentTemp >= states[i].temp) {
            if (currentState !== i) {
                currentState = i;
                iceImage.src = states[i].image;
                status.textContent = states[i].status;
            }
            break;
        }
    }
}

function updateGraph() {
    // We only update the graph every 10 ticks (approx 1 second) to save performance, 
    // or we can update every tick. Let's update every tick but use totalSeconds logic.
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    
    // Push data
    tempChart.data.labels.push(elapsedTime.toFixed(1));
    tempChart.data.datasets[0].data.push(currentTemp);
    
    // Limit data points to keep browser happy (optional, keeps last 200 points)
    // if (tempChart.data.labels.length > 500) {
    //     tempChart.data.labels.shift();
    //     tempChart.data.datasets[0].data.shift();
    // }
    
    tempChart.update();
}

function heat() {
    if (currentTemp >= 110) {
        isHeating = false;
        heatButton.disabled = true;
        status.textContent = 'Water has completely evaporated!';
        clearInterval(timerInterval);
        clearInterval(heatingInterval); // Stop the loop
        return;
    }

    // Handle melting phase at 0°C
    if (currentTemp === MELTING_POINT && meltingEnergy < ENERGY_NEEDED_TO_MELT) {
        meltingEnergy++;
        status.textContent = `Ice melting: ${Math.round((meltingEnergy/ENERGY_NEEDED_TO_MELT) * 100)}%`;
        updateGraph(); // Update graph during phase change (flat line)
        return;
    }

    // Handle boiling phase at 100°C
    if (Math.floor(currentTemp) === BOILING_POINT && boilingEnergy < ENERGY_NEEDED_TO_BOIL) {
        boilingEnergy++;
        status.textContent = `Water boiling: ${Math.round((boilingEnergy/ENERGY_NEEDED_TO_BOIL) * 100)}%`;
        updateGraph(); // Update graph during phase change (flat line)
        return;
    }

    // Regular temperature increase
    if (currentTemp < MELTING_POINT || 
        (currentTemp === MELTING_POINT && meltingEnergy >= ENERGY_NEEDED_TO_MELT) ||
        (currentTemp > MELTING_POINT && currentTemp < BOILING_POINT) ||
        (currentTemp >= BOILING_POINT && boilingEnergy >= ENERGY_NEEDED_TO_BOIL)) {
        
        currentTemp += 0.1;
        currentTemp = Math.min(110, Math.round(currentTemp * 10) / 10);
    }

    temperature.textContent = `Temperature: ${currentTemp.toFixed(1)}°C`;
    const progress = ((currentTemp + 20) / 130) * 100;
    progressBarFill.style.width = `${progress}%`;
    updateIceImage();
    updateGraph(); // Update graph during temp rise
}

heatButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    clearInterval(heatingInterval);

    // Reset Simulation values
    currentTemp = -20;
    meltingEnergy = 0;
    boilingEnergy = 0;
    currentState = 0;
    isHeating = true;

    // Reset Display
    iceImage.src = states[0].image;
    status.textContent = states[0].status;
    temperature.textContent = `Temperature: -20.0°C`;
    progressBarFill.style.width = `0%`;
    timerDisplay.textContent = `Time: 0:00`;
    
    // --- RESET GRAPH ---
    tempChart.data.labels = [];
    tempChart.data.datasets[0].data = [];
    tempChart.update();

    heatButton.disabled = true;

    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    heatingInterval = setInterval(heat, 100); 

});
