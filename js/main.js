const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const resetButton = document.getElementById('resetButton');
const setSizeButton = document.getElementById('setSizeButton');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const eraserButton = document.getElementById('eraserButton');
const drawButton = document.getElementById('drawButton');
const animateButton = document.getElementById('animateButton');
const gridSizeInput = document.getElementById('gridSize');

let currentColor = colorPicker.value;
let isEraserActive = false;

colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    isEraserActive = false; // Disable eraser when color is changed
});

eraserButton.addEventListener('click', () => {
    isEraserActive = true;
});

drawButton.addEventListener('click', () => {
    isEraserActive = false;
});

// Generate a grid with given size
function createGrid(size) {
    grid.innerHTML = ''; // Clear existing grid
    grid.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    grid.style.gridTemplateRows = `repeat(${size}, 20px)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => {
            cell.style.backgroundColor = isEraserActive ? 'white' : currentColor;
        });
        grid.appendChild(cell);
    }
}

// Reset the grid
resetButton.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.backgroundColor = 'white');
});

// Update grid size based on user input
setSizeButton.addEventListener('click', () => {
    const newSize = parseInt(gridSizeInput.value);
    if (newSize >= 2 && newSize <= 64) {
        createGrid(newSize);
    } else {
        alert('Please enter a size between 2 and 64.');
    }
});

// Save the grid to LocalStorage
saveButton.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    const gridData = Array.from(cells).map(cell => cell.style.backgroundColor || 'white');
    localStorage.setItem('pixelArt', JSON.stringify(gridData));
    localStorage.setItem('gridSize', gridSizeInput.value);
    alert('Grid saved!');
});

// Load the grid from LocalStorage
loadButton.addEventListener('click', () => {
    const gridData = localStorage.getItem('pixelArt');
    const gridSize = localStorage.getItem('gridSize');

    if (gridData && gridSize) {
        try {
            const parsedGridData = JSON.parse(gridData);
            const parsedGridSize = parseInt(gridSize);

            if (Array.isArray(parsedGridData) && !isNaN(parsedGridSize)) {
                gridSizeInput.value = parsedGridSize;
                createGrid(parsedGridSize);

                const cells = document.querySelectorAll('.cell');
                cells.forEach((cell, index) => {
                    cell.style.backgroundColor = parsedGridData[index];
                });
                alert('Grid loaded successfully!');
            } else {
                throw new Error('Invalid data in LocalStorage');
            }
        } catch (error) {
            console.error('Error loading grid:', error);
            alert('Failed to load grid. Please check saved data.');
        }
    } else {
        alert('No saved grid found.');
    }
});

// Animate the grid
animateButton.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    let colorIndex = 0;

    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.style.backgroundColor = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
        }, index * 50); // Adjust speed of animation
    });
});

// Initialize the grid
createGrid(16);


// Legg til en variabel for å holde styr på om museknappen er trykket ned
let isMouseDown = false;

// Event for å starte maling når museknappen trykkes ned
grid.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    paintCell(e);
});

// Event for å male celler når musen beveger seg og knappen er trykket ned
grid.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        paintCell(e);
    }
});

// Event for å slippe museknappen og stoppe maling
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Funksjon for å farge cellen der musen er
function paintCell(e) {
    if (e.target.classList.contains('cell')) {
        e.target.style.backgroundColor = isEraserActive ? 'white' : currentColor;
    }
}
