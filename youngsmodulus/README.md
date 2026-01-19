# Young's Modulus Practical - Searle's Apparatus

An interactive web-based on-screen experiment for measuring Young's Modulus using Searle's wire stretching apparatus. Students read micrometer images, add masses to the apparatus, and record extension measurements. Data is then used to draw graphs and calculate Young's Modulus on paper.

## Overview

Young's Modulus is a measure of the stiffness of a material, defined as the ratio of stress to strain within the elastic limit. This practical uses Searle's apparatus to measure the extension of a wire under increasing load.

### Formula

```
E = (Gradient × L) / A
```

Where:
- **E** = Young's Modulus (Pa)
- **Gradient** = Slope from load vs extension graph (N/mm)
- **L** = Original length of wire (m)
- **A** = Cross-sectional area of wire (m²) = π × r²

## Features

### 1. **Micrometer Image Reading**
- Three static micrometer images (SVG) showing different wire diameter readings
- Students manually enter their readings from each image
- Automatic average calculation
- Realistic micrometer scale with 0.01 mm precision

### 2. **Visual Apparatus**
- Interactive SVG representation of Searle's apparatus
- Fixed clamp, movable clamp, and pulley system
- Visual wire extension animation as masses are added
- Mass holder displays current load

### 3. **Mass Management**
- Add/remove 100g masses incrementally
- Visual feedback showing current load in grams
- Vernier scale reset for each new measurement

### 4. **Extension Measurement**
- Students manually enter vernier scale readings
- Automatic calculation of extension from initial reading
- Real-time data collection with force calculations

### 5. **Data Collection**
- Table showing all recorded measurements
- Displays mass, force (N), and extension (mm)
- Easy delete function for correcting mistakes

### 6. **Graph Instructions**
- Clear step-by-step guide for drawing graph on paper
- Instructions for calculating gradient
- Calculation guide for Young's Modulus
- Shows wire dimensions and cross-sectional area

### 7. **Print & Export**
- Print data summary to take to lab/class
- Professional formatting for recording results

## How to Use

### Step 1: Read Micrometer Images
1. Examine the three SVG micrometer images carefully
2. Each shows a different measurement of the wire diameter
3. Enter all three diameter readings in mm (e.g., 2.45, 2.42, 2.46)
4. The average is calculated automatically
5. Example readings are provided: ~2.4 mm

### Step 2: Confirm Setup
1. Enter the **wire length** (typically 1.0 - 2.0 meters from clamp to reference mark)
2. Enter the **initial vernier reading** (e.g., 0.0 mm at the start)
3. Click **"Confirm Setup"**
4. The system calculates cross-sectional area automatically

### Step 3: Conduct the Experiment
1. Click **"+ Add 100g"** to add the first mass
2. The apparatus animates to show wire extension
3. Read the vernier scale at the new position
4. Enter the vernier reading (this is the new position, not the extension)
5. Click **"Record Extension Reading"**
6. The extension is automatically calculated from your initial reading

### Step 4: Repeat Measurements
- Add another 100g mass
- Read the new vernier scale position
- Record the reading
- Repeat for 5-6 data points

### Step 5: Draw Your Graph (On Paper)
1. Use your collected data from the table
2. On graph paper, draw axes:
   - X-axis: **Extension (mm)**
   - Y-axis: **Load (N)**
3. Plot all your data points
4. Draw a best-fit straight line through the points
5. Calculate the gradient (slope):
   - Gradient = ΔLoad / ΔExtension (N/mm)

### Step 6: Calculate Young's Modulus
Use the formula provided:
```
E = (Gradient × L) / A
```

Where:
- **Gradient** = your line's slope from the graph (in N/mm)
- **L** = wire length in meters
- **A** = cross-sectional area in m² (shown in the "Next Steps" section)

## Physical Principles

### Stress and Strain
- **Stress** = Force / Area = F/A
- **Strain** = Extension / Original Length = ΔL/L
- **Young's Modulus** = Stress / Strain

### Why Graph Method?
Students plot the data on paper and draw their own best-fit line to:
1. **Develop practical skills** - manual graph drawing and line fitting
2. **Understand the physics** - seeing the linear relationship between load and extension
3. **Assess uncertainty** - visually estimating error by looking at data scatter
4. **Practice calculations** - finding gradients and using formulas

## Tips for Accurate Results

1. **Diameter Measurement**
   - Take micrometer readings at 3 different points along the wire
   - Use average to reduce measurement error

2. **Initial Vernier Reading**
   - Record carefully before adding any masses
   - This is the reference point

3. **Load the Wire Gradually**
   - Allow time for stabilization between readings
   - Read vernier scale from the same position each time

4. **Take Multiple Measurements**
   - Aim for at least 6 data points
   - Space loads evenly (100g increments)

5. **Graph Quality**
   - Use ruler for axes and best-fit line
   - Use pencil to allow corrections
   - Mark axis scales clearly

## Expected Results

### For Steel Wire
- **Expected Young's Modulus**: 200 GPa (2.0 × 10¹¹ Pa)
- **Typical Range**: 180-220 GPa (±10% from expected)

### Realistic Values
- Wire diameter: 2-3 mm (copper or steel)
- Extension per 100g load: 0.5-2 mm (depends on wire properties)
- Gradient: 50-200 N/mm (depending on wire stiffness)

## Data Sheet Template

| Mass (g) | Force (N) | Extension (mm) |
|----------|-----------|----------------|
| 100      |           |                |
| 200      |           |                |
| 300      |           |                |
| 400      |           |                |
| 500      |           |                |
| 600      |           |                |

Use these values to plot your graph:
- **X-axis (Horizontal):** Extension (mm)
- **Y-axis (Vertical):** Force (N)

Calculate gradient = ΔF / Δx = (N/mm)

## Technical Specifications

- **Language**: HTML5, CSS3, JavaScript (ES6+)
- **Browser Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **No External Dependencies**: Pure vanilla JavaScript
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

1. Download all three files: `index.html`, `styles.css`, `script.js`
2. Place them in the same directory
3. Open `index.html` in a web browser
4. No server or installation required

## Files

- **index.html** - Main HTML structure with form elements
- **styles.css** - Complete styling and responsive design
- **script.js** - All interactive functionality and calculations

## Constants

The application uses the following constants:
- **Gravity (g)**: 9.81 m/s²
- **Material**: Steel wire
- **Expected Young's Modulus**: 200 GPa

These can be modified in `script.js` if needed.

## Tips for Accurate Results

1. **Calibrate instruments** before starting
2. **Use at least 6 data points** for good statistics
3. **Record measurements carefully** - watch for parallax errors
4. **Load the wire gradually** - allow time for stabilization
5. **Take multiple measurements** at each load point
6. **Check for elastic deformation** - wire should return if unloaded

## Typical Experimental Procedure

1. **Setup**: Clamp wire, set reference mark, measure diameter at 3 points (take average)
2. **Initial Reading**: With zero load, record initial extension reading
3. **Apply Load**: Add first mass (100g)
4. **Record Reading**: Measure total extension from original mark
5. **Repeat**: Continue adding 100g masses and recording extensions
6. **Stop**: When extension becomes too large (>5mm) or apparatus reaches limit

## Calculations Performed Automatically

The application automatically calculates:

1. **Average Wire Diameter**: Mean of three micrometer readings
2. **Cross-sectional Area**: A = π × r² (from average diameter)
3. **Applied Force**: F = m × g (where g = 9.81 m/s²)
4. **Extension**: Current vernier reading - initial reading
5. Displays formula breakdown for student calculations

## Sources of Error

1. **Measurement Errors**:
   - Parallax when reading micrometer or vernier scales
   - Non-uniform wire diameter (take multiple readings)
   - Instrument zero errors

2. **Experimental Errors**:
   - Temperature changes affecting wire length
   - Friction in pulley system
   - Timing between load addition and measurement
   - Vibrations affecting readings

## License

Educational use - Physics practical simulator

## Support

For issues or suggestions, please refer to the physics department or teaching staff.

---

**Last Updated**: January 2026
**Suitable for**: Secondary/Tertiary Physics Education (A-Levels, IB, University)
