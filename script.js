const temperature = document.getElementById('temperature');
const progressBarFill = document.getElementById('progress-bar-fill');
const heatButton = document.getElementById('heatButton');
const status = document.getElementById('status');
const iceImage = document.getElementById('iceImage');
const timerDisplay = document.getElementById('timer');

let currentTemp = -20;
let isHeating = false;
let startTime;
let timerInterval;
let meltingEnergy = 0;
let boilingEnergy = 0;
let currentState = 0;  // Track the current state index
let heatingInterval; // This allows us to stop the heat loop later
// Phase change thresholds
const MELTING_POINT = 0;
const BOILING_POINT = 100;
const ENERGY_NEEDED_TO_MELT = 150; // arbitrary units
const ENERGY_NEEDED_TO_BOIL = 250; // arbitrary units

const states = [
    { temp: -19.9, image: 'https://doormat1.github.io/heating_images/solid_heating.gif', status: 'Frozen ice cube' },
    { temp: 0, image: 'https://doormat1.github.io/heating_images/Melting.gif', status: 'Ice melting (0°C)' },
    { temp: 0.1, image: 'https://doormat1.github.io/heating_images/Heating_water.gif', status: 'Liquid water heating up' },
    { temp: 100, image: 'https://doormat1.github.io/heating_images/Boiling.gif', status: 'Water boiling (100°C)' },
    { temp: 100.1, image: 'https://doormat1.github.io/heating_images/Steam_new.gif', status: 'Water has evaporated, now heating the steam' }
];

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Replace the existing updateIceImage function
function updateIceImage() {
    for (let i = states.length - 1; i >= 0; i--) {
        if (currentTemp >= states[i].temp) {
            // Only update if the state has changed
            if (currentState !== i) {
                currentState = i;
                iceImage.src = states[i].image;
                status.textContent = states[i].status;
            }
            break;
        }
    }
}

function heat() {
    if (currentTemp >= 110) {
        isHeating = false;
        heatButton.disabled = true;
        status.textContent = 'Water has completely evaporated!';
        clearInterval(timerInterval);
        return;
    }

    // Handle melting phase at 0°C
    if (currentTemp === MELTING_POINT && meltingEnergy < ENERGY_NEEDED_TO_MELT) {
        meltingEnergy++;
        status.textContent = `Ice melting: ${Math.round((meltingEnergy/ENERGY_NEEDED_TO_MELT) * 100)}%`;
        return;
    }

    // Handle boiling phase at 100°C
    if (Math.floor(currentTemp) === BOILING_POINT && boilingEnergy < ENERGY_NEEDED_TO_BOIL) {
        boilingEnergy++;
        status.textContent = `Water boiling: ${Math.round((boilingEnergy/ENERGY_NEEDED_TO_BOIL) * 100)}%`;
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
}

heatButton.addEventListener('click', () => {
    // 1. Stop any existing loops (prevents speed-up if clicked again)
    clearInterval(timerInterval);
    clearInterval(heatingInterval);

    // 2. Reset all simulation values to the start
    currentTemp = -20;
    meltingEnergy = 0;
    boilingEnergy = 0;
    currentState = 0;
    isHeating = true;

    // 3. Reset the Display
    iceImage.src = states[0].image;
    status.textContent = states[0].status;
    temperature.textContent = `Temperature: -20.0°C`;
    progressBarFill.style.width = `0%`;
    timerDisplay.textContent = `Time: 0:00`;
    
    // 4. Disable button during simulation
    heatButton.disabled = true;

    // 5. Start the timers fresh
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    heatingInterval = setInterval(heat, 100); 

});
