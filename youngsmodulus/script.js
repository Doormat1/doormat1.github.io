// Constants
const G = 9.81; // m/s²
const MASS_INCREMENT = 0.1; // kg (100g)
const MM_TO_PX = 60; // Scale factor: 1mm = 60px on the vernier scale

// State
let state = {
    diameterReadings: [],
    averageDiameter: null,
    wireLengthMeters: null,
    initialVernierReading: null,
    currentMassCount: 0,
    collectedData: [],
    currentExtensionMm: 0
};


// DOM Elements - Diameter
const diameterInputs = document.querySelectorAll('.diameter-input');
const averageDiameterDisplay = document.getElementById('averageDiameter');

// DOM Elements - Setup
const wireLengthInput = document.getElementById('wireLengthInput');
const initialVernierInput = document.getElementById('initialVernierInput');
const confirmSetupBtn = document.getElementById('confirmSetupBtn');

// DOM Elements - Experiment
const addMassBtn = document.getElementById('addMassBtn');
const removeMassBtn = document.getElementById('removeMassBtn');
const currentMassCountDisplay = document.getElementById('currentMassCount');
const currentMassGramsDisplay = document.getElementById('currentMassGrams');
const massDisplay = document.getElementById('massDisplay');
const testWireLine = document.getElementById('testWireLine');
const vernierScaleGroup = document.getElementById('vernierScaleGroup');

// DOM Elements - Vernier Scale SVG
const vernierScale = document.getElementById('vernierScale');
const vernierReadingText = document.getElementById('vernierReadingText');

// DOM Elements - Recording
const vernierReadingInput = document.getElementById('vernierReadingInput');
const recordReadingBtn = document.getElementById('recordReadingBtn');
const collectionTableBody = document.getElementById('collectionTableBody');

// DOM Elements - Results
const summaryTableBody = document.getElementById('summaryTableBody');
const noDataSummary = document.getElementById('noDataSummary');
const displayWireLength = document.getElementById('displayWireLength');
const displayDiameter = document.getElementById('displayDiameter');
const displayRadius = document.getElementById('displayRadius');
const displayArea = document.getElementById('displayArea');
const displayLength2 = document.getElementById('displayLength2');
const areaPlaceholder = document.getElementById('areaPlaceholder');

// DOM Elements - Buttons
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');


// Event Listeners - Diameter
diameterInputs.forEach(input => {
    input.addEventListener('input', updateAverageDiameter);
});

// Event Listeners - Setup
confirmSetupBtn.addEventListener('click', confirmSetup);

// Event Listeners - Experiment
addMassBtn.addEventListener('click', addMass);
removeMassBtn.addEventListener('click', removeMass);
recordReadingBtn.addEventListener('click', recordReading);

// Event Listeners - Control
resetBtn.addEventListener('click', resetExperiment);
printBtn.addEventListener('click', printDataSheet);


// ==================== DIAMETER MEASUREMENTS ====================

function updateAverageDiameter() {
    // Get all diameter readings that have values
    let readings = [];
    diameterInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            readings.push(value);
        }
    });

    if (readings.length > 0) {
        const average = readings.reduce((a, b) => a + b, 0) / readings.length;
        state.diameterReadings = readings;
        state.averageDiameter = average;
        averageDiameterDisplay.textContent = average.toFixed(3) + ' mm';
    } else {
        averageDiameterDisplay.textContent = '-';
        state.averageDiameter = null;
    }
}

// ==================== SETUP ====================

function confirmSetup() {
    if (state.averageDiameter === null) {
        alert('Please enter all three diameter readings first');
        return;
    }

    const wireLength = parseFloat(wireLengthInput.value);
    const initialVernier = parseFloat(initialVernierInput.value);

    if (isNaN(wireLength) || wireLength <= 0) {
        alert('Please enter a valid wire length');
        return;
    }

    if (isNaN(initialVernier) || initialVernier < 0) {
        alert('Please enter a valid initial vernier reading');
        return;
    }

    state.wireLengthMeters = wireLength;
    state.initialVernierReading = initialVernier;

    // Update display values
    displayWireLength.textContent = wireLength.toFixed(2);
    displayLength2.textContent = wireLength.toFixed(2);
    displayDiameter.textContent = state.averageDiameter.toFixed(3) + ' mm';

    // Calculate and display cross-sectional area
    const diameterM = state.averageDiameter / 1000;
    const radiusM = diameterM / 2;
    const areaM2 = Math.PI * radiusM * radiusM;

    displayRadius.textContent = radiusM.toExponential(3) + ' m';
    displayArea.textContent = areaM2.toExponential(3) + ' m²';
    areaPlaceholder.textContent = areaM2.toExponential(3);

    // Enable mass buttons
    addMassBtn.disabled = false;
    removeMassBtn.disabled = false;
    confirmSetupBtn.disabled = true;
    wireLengthInput.disabled = true;
    initialVernierInput.disabled = true;
    diameterInputs.forEach(input => {
        input.disabled = true;
    });

    alert(`✓ Setup confirmed!\nWire diameter: ${state.averageDiameter.toFixed(3)} mm\nWire length: ${wireLength.toFixed(2)} m\n\nYou can now add masses and record extensions.`);
}

// ==================== MASS MANAGEMENT ====================

function addMass() {
    if (state.wireLengthMeters === null) {
        alert('Please confirm setup first');
        return;
    }

    state.currentMassCount++;
    updateMassDisplay();
}

function removeMass() {
    if (state.currentMassCount > 0) {
        state.currentMassCount--;
        updateMassDisplay();
    }
}

function updateMassDisplay() {
    const massGrams = state.currentMassCount * 100;
    currentMassCountDisplay.textContent = state.currentMassCount;
    currentMassGramsDisplay.textContent = massGrams;
    massDisplay.textContent = massGrams + 'g';

    // Calculate extension with realistic variation
    // Base extension ~0.6mm per 100g, but with random variation ±0.1mm per mass
    let totalExtension = 0;
    for (let i = 0; i < state.currentMassCount; i++) {
        const variation = (Math.random() - 0.5) * 0.2; // ±0.1mm variation
        totalExtension += 0.6 + variation; // ~0.6mm per 100g plus variation
    }
    
    state.currentExtensionMm = totalExtension;
    
    // Update apparatus visualization
    updateApparatusVisualization(totalExtension);
    
    // Update vernier scale
    updateVernierScale(totalExtension);
}

function updateApparatusVisualization(extensionMm) {
    // Scale extension for visualization (exaggerate for visibility)
    const extensionPx = extensionMm * 8; // 1mm = 8px for apparatus
    
    // Update test wire length
    if (testWireLine) {
        const newY2 = 320 + extensionPx;
        testWireLine.setAttribute('y2', newY2);
    }
    
    // Move vernier scale group with wire extension
    if (vernierScaleGroup) {
        vernierScaleGroup.setAttribute('transform', `translate(0, ${extensionPx})`);
    }
}

function updateVernierScale(extensionMm) {
    // Update the vernier scale position
    // 1 mm = 60 px on the scale
    const translateX = extensionMm * MM_TO_PX;
    
    if (vernierScale) {
        vernierScale.setAttribute('transform', `translate(${translateX}, 0)`);
    }
    
    if (vernierReadingText) {
        vernierReadingText.textContent = extensionMm.toFixed(1) + ' mm';
    }
}

// ==================== RECORDING DATA ====================

function recordReading() {
    if (state.wireLengthMeters === null) {
        alert('Please confirm setup first');
        return;
    }

    if (state.currentMassCount === 0) {
        alert('Please add at least one mass before recording');
        return;
    }

    const vernierReading = parseFloat(vernierReadingInput.value);

    if (isNaN(vernierReading)) {
        alert('Please enter a valid vernier reading');
        return;
    }

    const massGrams = state.currentMassCount * 100;
    const massKg = massGrams / 1000;
    const force = massKg * G;
    const extensionMm = vernierReading - state.initialVernierReading;

    // Store data point
    const dataPoint = {
        mass: massGrams,
        force: force,
        extension: extensionMm
    };

    state.collectedData.push(dataPoint);

    // Update collection table
    updateCollectionTable();

    // Update summary table
    updateSummaryTable();

    // Clear input
    vernierReadingInput.value = '';
    vernierReadingInput.focus();

    alert(`✓ Reading recorded!\nMass: ${massGrams}g, Force: ${force.toFixed(3)}N, Extension: ${extensionMm.toFixed(1)}mm`);
}

function updateCollectionTable() {
    collectionTableBody.innerHTML = '';

    state.collectedData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.mass}</td>
            <td>${data.force.toFixed(3)}</td>
            <td>${data.extension.toFixed(1)}</td>
            <td>✓</td>
        `;
        collectionTableBody.appendChild(row);
    });
}

function updateSummaryTable() {
    if (state.collectedData.length === 0) {
        summaryTableBody.innerHTML = '';
        noDataSummary.style.display = 'block';
        return;
    }

    noDataSummary.style.display = 'none';
    summaryTableBody.innerHTML = '';

    state.collectedData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.mass}</td>
            <td>${data.force.toFixed(3)}</td>
            <td>${data.extension.toFixed(1)}</td>
            <td><button class="delete-btn" onclick="deleteDataPoint(${index})">Delete</button></td>
        `;
        summaryTableBody.appendChild(row);
    });
}

function deleteDataPoint(index) {
    state.collectedData.splice(index, 1);
    updateCollectionTable();
    updateSummaryTable();
}

// ==================== PRINT & EXPORT ====================

function printDataSheet() {
    if (state.collectedData.length === 0) {
        alert('Please record at least one data point first');
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');

    let content = `
        <html>
        <head>
            <title>Young's Modulus - Experimental Data</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                table, th, td { border: 1px solid #333; }
                th, td { padding: 10px; text-align: left; }
                th { background-color: #2563eb; color: white; }
                .info-box { background: #f0f0f0; padding: 15px; margin: 20px 0; }
                .calculation-box { background: #ffffcc; padding: 15px; margin: 20px 0; font-family: monospace; }
            </style>
        </head>
        <body>
            <h1>Young's Modulus Practical - Experimental Data</h1>
            <h2>Apparatus Details</h2>
            <div class="info-box">
                <p><strong>Wire Diameter (average):</strong> ${state.averageDiameter.toFixed(3)} mm</p>
                <p><strong>Wire Length:</strong> ${state.wireLengthMeters.toFixed(2)} m</p>
                <p><strong>Initial Vernier Reading:</strong> ${state.initialVernierReading.toFixed(1)} mm</p>
            </div>

            <h2>Experimental Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Mass (g)</th>
                        <th>Force (N)</th>
                        <th>Extension (mm)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    state.collectedData.forEach(data => {
        content += `
                    <tr>
                        <td>${data.mass}</td>
                        <td>${data.force.toFixed(3)}</td>
                        <td>${data.extension.toFixed(1)}</td>
                    </tr>
        `;
    });

    content += `
                </tbody>
            </table>

            <h2>Next Steps</h2>
            <ol>
                <li>On graph paper, plot Load (N) vs Extension (mm)</li>
                <li>Draw a best-fit line through your data points</li>
                <li>Calculate the gradient of your line</li>
                <li>Use the formula: E = (Gradient × L) / A</li>
            </ol>

            <h2>Calculations</h2>
            <div class="calculation-box">
                <p>Wire diameter (average): ${state.averageDiameter.toFixed(3)} mm</p>
                <p>Wire radius: ${(state.averageDiameter / 2000).toExponential(3)} m</p>
                <p>Cross-sectional area (A): π × r² = ${(Math.PI * Math.pow(state.averageDiameter / 2000, 2)).toExponential(3)} m²</p>
                <br>
                <p><strong>Young's Modulus Formula:</strong></p>
                <p>E = (Gradient × L) / A</p>
                <p>E = (Your gradient N/mm × ${state.wireLengthMeters.toFixed(2)} m) / ${(Math.PI * Math.pow(state.averageDiameter / 2000, 2)).toExponential(3)} m²</p>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
}

// ==================== RESET ====================

function resetExperiment() {
    if (confirm('Reset the entire experiment? All data will be lost.')) {
        state = {
            diameterReadings: [],
            averageDiameter: null,
            wireLengthMeters: null,
            initialVernierReading: null,
            currentMassCount: 0,
            collectedData: [],
            currentExtensionMm: 0
        };

        // Clear inputs
        diameterInputs.forEach(input => {
            input.value = '';
            input.disabled = false;
        });
        wireLengthInput.value = '1.0';
        wireLengthInput.disabled = false;
        initialVernierInput.value = '0.0';
        initialVernierInput.disabled = false;
        vernierReadingInput.value = '';

        // Reset displays
        averageDiameterDisplay.textContent = '-';
        currentMassCountDisplay.textContent = '0';
        currentMassGramsDisplay.textContent = '0';
        massDisplay.textContent = '0g';
        summaryTableBody.innerHTML = '';
        collectionTableBody.innerHTML = '';
        noDataSummary.style.display = 'block';

        displayDiameter.textContent = '-';
        displayRadius.textContent = '-';
        displayArea.textContent = '-';
        areaPlaceholder.textContent = '-';

        // Reset apparatus visualization
        if (testWireLine) {
            testWireLine.setAttribute('y2', '320');
        }
        if (vernierScaleGroup) {
            vernierScaleGroup.setAttribute('transform', 'translate(0, 0)');
        }

        // Reset vernier scale
        if (vernierScale) {
            vernierScale.setAttribute('transform', 'translate(0, 0)');
        }
        if (vernierReadingText) {
            vernierReadingText.textContent = '0.0 mm';
        }

        // Disable mass buttons
        addMassBtn.disabled = true;
        removeMassBtn.disabled = true;
        confirmSetupBtn.disabled = false;

        alert('✓ Experiment reset');
    }
}

// ==================== VERNIER SCALE INITIALIZATION ====================

function initializeVernierScale() {
    const mainScale = document.getElementById('mainScale');
    const vernierScaleSVG = document.getElementById('vernierScale');
    
    if (!mainScale || !vernierScaleSVG) return;
    
    // Create main scale markings (0 to 10 mm)
    for (let i = 0; i <= 10; i++) {
        const x = 50 + (i * MM_TO_PX);
        
        // Major marking (every mm)
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', '40');
        line.setAttribute('x2', x);
        line.setAttribute('y2', '70');
        line.setAttribute('stroke', '#000');
        line.setAttribute('stroke-width', '2');
        mainScale.appendChild(line);
        
        // Number label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', '80');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', 'bold');
        text.textContent = i;
        mainScale.appendChild(text);
        
        // Minor markings (0.5 mm intervals)
        if (i < 10) {
            const halfX = x + (MM_TO_PX / 2);
            const halfLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            halfLine.setAttribute('x1', halfX);
            halfLine.setAttribute('y1', '40');
            halfLine.setAttribute('x2', halfX);
            halfLine.setAttribute('y2', '60');
            halfLine.setAttribute('stroke', '#666');
            halfLine.setAttribute('stroke-width', '1.5');
            mainScale.appendChild(halfLine);
        }
    }
    
    // Create vernier scale markings (9 divisions = 10 main scale divisions)
    // Each vernier division = 54px (0.9mm in terms of main scale)
    // This creates 0.1mm precision
    const vernierDivisions = 10;
    const vernierSpacing = (MM_TO_PX * 9) / 10; // 54px per division
    
    for (let i = 0; i <= vernierDivisions; i++) {
        const x = 50 + (i * vernierSpacing);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', '90');
        line.setAttribute('x2', x);
        line.setAttribute('y2', '120');
        line.setAttribute('stroke', '#0066cc');
        line.setAttribute('stroke-width', '2');
        vernierScaleSVG.appendChild(line);
        
        // Number label for vernier scale
        if (i % 2 === 0) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', '135');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '10');
            text.setAttribute('fill', '#0066cc');
            text.setAttribute('font-weight', 'bold');
            text.textContent = i;
            vernierScaleSVG.appendChild(text);
        }
    }
}

// ==================== INITIALIZATION ====================

// Disable mass buttons until setup is confirmed
addMassBtn.disabled = true;
removeMassBtn.disabled = true;

// Pre-fill micrometer example values (students should replace these)
diameterInputs[0].placeholder = '2.45 (example)';
diameterInputs[1].placeholder = '2.42 (example)';
diameterInputs[2].placeholder = '2.46 (example)';

// Initialize vernier scale when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeVernierScale();
});
