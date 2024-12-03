// Variables globales
let rowsA, colsA, rowsB, colsB;

// Función para cargar el formulario correspondiente
function selectOperation() {
    const operation = document.getElementById('operation').value;
    const container = document.getElementById('algorithm-container');
    container.innerHTML = '';

    switch (operation) {
        case 'matrix-multiplication':
            loadMatrixMultiplicationForm();
            break;
        case 'determinant-calculation':
            loadDeterminantForm();
            break;
        case 'matrix-inverse':
            loadInverseForm();
            break;
        case 'linear-system-solver':
            loadLinearSystemForm();
            break;
        default:
            container.innerHTML = '';
    }
}

// Función para cargar formularios
function loadForm(htmlContent) {
    const container = document.getElementById('algorithm-container');
    container.innerHTML = htmlContent;
}

// Funciones de carga de formularios simplificadas
function loadMatrixMultiplicationForm() {
    loadForm(`
        <div class="algorithm">
            <h2>Multiplicación de Matrices</h2>
            <div>
                <label>Tamaño de la matriz A:</label>
                <input type="number" id="rowsA" min="1" value="2"> x
                <input type="number" id="colsA" min="1" value="2">
            </div>
            <div>
                <label>Tamaño de la matriz B:</label>
                <input type="number" id="rowsB" min="1" value="2"> x
                <input type="number" id="colsB" min="1" value="2">
            </div>
            <button onclick="generateMatrices('multiplication')">Generar Matrices</button>
            <div id="matrices-container"></div>
            <div id="result"></div>
            <button onclick="loadLastResult('lastMultiplication')">Cargar Último Resultado</button>
        </div>
    `);
}

function loadDeterminantForm() {
    loadForm(`
        <div class="algorithm">
            <h2>Cálculo de Determinante</h2>
            <div>
                <label>Tamaño de la matriz (n x n):</label>
                <input type="number" id="size" min="1" value="2">
            </div>
            <button onclick="generateMatrices('determinant')">Generar Matriz</button>
            <div id="matrices-container"></div>
            <div id="result"></div>
            <button onclick="loadLastResult('lastDeterminant')">Cargar Último Resultado</button>
        </div>
    `);
}

function loadInverseForm() {
    loadForm(`
        <div class="algorithm">
            <h2>Inversa de una Matriz</h2>
            <div>
                <label>Tamaño de la matriz (n x n):</label>
                <input type="number" id="size" min="1" value="2">
            </div>
            <button onclick="generateMatrices('inverse')">Generar Matriz</button>
            <div id="matrices-container"></div>
            <div id="result"></div>
            <button onclick="loadLastResult('lastInverse')">Cargar Último Resultado</button>
        </div>
    `);
}

function loadLinearSystemForm() {
    loadForm(`
        <div class="algorithm">
            <h2>Resolución de Sistemas Lineales</h2>
            <div>
                <label>Número de ecuaciones (n):</label>
                <input type="number" id="size" min="1" value="2">
            </div>
            <button onclick="generateMatrices('linearSystem')">Generar Sistema</button>
            <div id="matrices-container"></div>
            <div id="result"></div>
            <button onclick="loadLastResult('lastSolution')">Cargar Último Resultado</button>
        </div>
    `);
}

// Función para generar matrices
function generateMatrices(operation) {
    const container = document.getElementById('matrices-container');
    container.innerHTML = '';

    const size = parseInt(document.getElementById('size')?.value || 0);
    rowsA = parseInt(document.getElementById('rowsA')?.value || 0);
    colsA = parseInt(document.getElementById('colsA')?.value || 0);
    rowsB = parseInt(document.getElementById('rowsB')?.value || 0);
    colsB = parseInt(document.getElementById('colsB')?.value || 0);

    if (operation === 'multiplication') {
        if (colsA !== rowsB) {
            alert('El número de columnas de A debe ser igual al número de filas de B.');
            return;
        }
        container.innerHTML += '<h3>Matriz A:</h3>';
        container.appendChild(createMatrixTable('A', rowsA, colsA));
        container.innerHTML += '<h3>Matriz B:</h3>';
        container.appendChild(createMatrixTable('B', rowsB, colsB));
        container.innerHTML += '<button onclick="performMatrixMultiplication()">Multiplicar</button>';
    } else if (operation === 'determinant' || operation === 'inverse') {
        container.innerHTML += '<h3>Matriz:</h3>';
        container.appendChild(createMatrixTable('Matrix', size, size));
        const action = operation === 'determinant' ? 'Calcular Determinante' : 'Calcular Inversa';
        container.innerHTML += `<button onclick="${operation === 'determinant' ? 'calculateDeterminant' : 'calculateInverse'}()">${action}</button>`;
    } else if (operation === 'linearSystem') {
        container.innerHTML += '<h3>Matriz de Coeficientes:</h3>';
        container.appendChild(createMatrixTable('Coefficients', size, size));
        container.innerHTML += '<h3>Vector de Términos Independientes:</h3>';
        container.appendChild(createMatrixTable('Constants', size, 1));
        container.innerHTML += '<button onclick="solveLinearSystem()">Resolver Sistema</button>';
    }
}

// Función para crear una matriz en forma de tabla
function createMatrixTable(name, rows, cols) {
    const table = document.createElement('table');
    table.id = `matrix${name}`;
    for (let i = 0; i < rows; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < cols; j++) {
            const td = tr.insertCell();
            td.innerHTML = `<input type="number" step="any" id="${name}_${i}_${j}" value="0">`;
        }
    }
    return table;
}

// Función para leer una matriz de la tabla
function readMatrix(name, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${name}_${i}_${j}`).value) || 0;
            matrix[i][j] = value;
        }
    }
    return matrix;
}

// Función para guardar datos en localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para cargar datos de localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Funciones de operaciones simplificadas
function performMatrixMultiplication() {
    const A = readMatrix('A', rowsA, colsA);
    const B = readMatrix('B', rowsB, colsB);
    const result = multiplyMatrices(A, B);
    if (result) {
        displayResult(result);
        saveData('lastMultiplication', result);
    }
}

function multiplyMatrices(A, B) {
    return A.map(row => B[0].map((_, j) => row.reduce((sum, val, i) => sum + val * B[i][j], 0)));
}

function calculateDeterminant() {
    const size = parseInt(document.getElementById('size').value);
    const matrix = readMatrix('Matrix', size, size);
    const det = determinant(matrix);
    if (det !== null) {
        displayResult(`Determinante: ${det}`);
        saveData('lastDeterminant', det);
    }
}

function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
    return matrix[0].reduce((acc, val, i) => acc + ((-1) ** i) * val * determinant(minor(matrix, 0, i)), 0);
}

function minor(matrix, row, col) {
    return matrix.slice(0, row).concat(matrix.slice(row + 1)).map(r => r.slice(0, col).concat(r.slice(col + 1)));
}

function calculateInverse() {
    const size = parseInt(document.getElementById('size').value);
    const matrix = readMatrix('Matrix', size, size);
    const inv = inverse(matrix);
    if (inv) {
        displayResult(inv);
        saveData('lastInverse', inv);
    }
}

function inverse(matrix) {
    const det = determinant(matrix);
    if (det === 0) {
        alert('La matriz no es invertible.');
        return null;
    }
    const adjugate = matrix.map((row, i) => row.map((_, j) => ((-1) ** (i + j)) * determinant(minor(matrix, i, j))));
    const adjugateTransposed = transpose(adjugate);
    return adjugateTransposed.map(row => row.map(val => val / det));
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function solveLinearSystem() {
    const size = parseInt(document.getElementById('size').value);
    const A = readMatrix('Coefficients', size, size);
    const b = readMatrix('Constants', size, 1).flat();
    const x = gaussianElimination(A, b);
    if (x) {
        displayResult(x.map((xi, index) => `x${index + 1} = ${xi}`).join('\n'));
        saveData('lastSolution', x);
    }
}

function gaussianElimination(A, b) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        A[i].push(b[i]);
    }
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        if (A[i][i] === 0) {
            alert('El sistema no tiene solución única.');
            return null;
        }
        for (let k = i + 1; k < n; k++) {
            const c = -A[k][i] / A[i][i];
            for (let j = i; j <= n; j++) {
                A[k][j] += c * A[i][j];
            }
        }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = A[i][n] / A[i][i];
        for (let k = i - 1; k >= 0; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }
    return x;
}

// Función para mostrar resultados
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    if (Array.isArray(result)) {
        if (Array.isArray(result[0])) {
            resultDiv.innerHTML = '<h3>Resultado:</h3><pre>' + result.map(row => row.join('\t')).join('\n') + '</pre>';
        } else {
            resultDiv.innerHTML = '<h3>Resultado:</h3><pre>' + result.join('\n') + '</pre>';
        }
    } else {
        resultDiv.innerHTML = '<h3>Resultado:</h3><pre>' + result + '</pre>';
    }
}

// Función para cargar el último resultado guardado
function loadLastResult(key) {
    const result = loadData(key);
    if (result) {
        displayResult(result);
    } else {
        alert('No hay resultados guardados para esta operación.');
    }
}
