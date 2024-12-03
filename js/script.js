document.getElementById('generarMatriz').addEventListener('click', generarMatriz);
document.getElementById('resolver').addEventListener('click', resolverSistema);
document.getElementById('reiniciar').addEventListener('click', reiniciar);
document.getElementById('verHistorial').addEventListener('click', toggleHistorial);

function generarMatriz() {
    const numEcuaciones = parseInt(document.getElementById('numEcuaciones').value);
    if (isNaN(numEcuaciones) || numEcuaciones < 2 || numEcuaciones > 10) {
        alert('Por favor, ingrese un número de ecuaciones válido (entre 2 y 10).');
        return;
    }

    const matrizContainer = document.getElementById('matrizContainer');
    matrizContainer.innerHTML = '';

    const table = document.createElement('table');

    for (let i = 0; i < numEcuaciones; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= numEcuaciones; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `a${i}${j}`;
            input.style.width = '60px';
            cell.appendChild(input);

            if (j < numEcuaciones - 1) {
                const plus = document.createElement('span');
                plus.className = 'texto-operador';
                plus.textContent = `x${j + 1} +`;
                cell.appendChild(plus);

            } else if (j === numEcuaciones - 1) {
                const equal = document.createElement('span');
                equal.className = 'texto-operador';
                equal.textContent = `x${j + 1} =`;
                cell.appendChild(equal);
                
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrizContainer.appendChild(table);

    document.getElementById('botonesAccion').style.display = 'flex';
}

function resolverSistema() {
    const numEcuaciones = parseInt(document.getElementById('numEcuaciones').value);
    const matriz = [];
    for (let i = 0; i < numEcuaciones; i++) {
        matriz[i] = [];
        for (let j = 0; j <= numEcuaciones; j++) {
            const valor = parseFloat(document.getElementById(`a${i}${j}`).value);
            if (isNaN(valor)) {
                alert('Por favor, ingrese todos los coeficientes y términos independientes.');
                return;
            }
            matriz[i][j] = valor;
        }
    }

    const soluciones = matriz.map(row => row[row.length - 1]); // Simula las soluciones
    mostrarResultado(soluciones);

    guardarHistorial(matriz, soluciones);
}

function mostrarResultado(soluciones) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpia cualquier contenido previo

    const titulo = document.createElement('h3');
    titulo.textContent = 'Las soluciones son:';
    titulo.className = 'resultado-titulo'; // Clase para el título
    resultadoDiv.appendChild(titulo);

    // Crear lista de soluciones
    const lista = document.createElement('ul');
    lista.className = 'lista-soluciones'; // Clase para la lista
    soluciones.forEach((sol, idx) => {
        const item = document.createElement('li');
        item.textContent = `x${idx + 1} = ${sol}`;
        item.className = 'solucion-item'; // Clase para cada solución
        lista.appendChild(item);
    });

    resultadoDiv.appendChild(lista);
}


function reiniciar() {
    document.getElementById('matrizContainer').innerHTML = '';
    document.getElementById('resultado').innerText = '';
    document.getElementById('botonesAccion').style.display = 'none';
    document.getElementById('numEcuaciones').value = '';
}

function guardarHistorial(matriz, soluciones) {
    const historialDiv = document.getElementById('historial');

    // Crear un nuevo elemento de historial
    const historialItem = {
        matriz: matriz,
        soluciones: soluciones
    };

    // Obtener el historial actual de LocalStorage
    let historial = JSON.parse(localStorage.getItem('historial')) || [];

    // Agregar el nuevo historial al arreglo
    historial.push(historialItem);

    // Guardar el historial actualizado en LocalStorage
    localStorage.setItem('historial', JSON.stringify(historial));

    // Actualizar la interfaz de usuario
    renderizarHistorial();
}

function renderizarHistorial() {
    const historialDiv = document.getElementById('historial');
    historialDiv.innerHTML = ''; // Limpiar el historial actual

    // Obtener el historial de LocalStorage
    const historial = JSON.parse(localStorage.getItem('historial')) || [];

    // Si no hay historial, esconder el contenedor
    if (historial.length === 0) {
        historialDiv.style.display = 'none';
        return;
    }

    // Crear elementos para cada historial
    historial.forEach((item, index) => {
        const historialItem = document.createElement('div');
        historialItem.className = 'historial-item';

        // Título del historial
        const titulo = document.createElement('h3');
        titulo.textContent = `Sistema Resuelto ${index + 1}`;
        historialItem.appendChild(titulo);

        // Texto de la matriz
        const matrizTexto = document.createElement('pre');
        matrizTexto.textContent = `Matriz:\n${item.matriz.map(row => row.join(' ')).join('\n')}`;
        historialItem.appendChild(matrizTexto);

        // Texto de las soluciones
        const solucionesTexto = document.createElement('p');
        solucionesTexto.textContent = `Soluciones:\n${item.soluciones.map((s, i) => `x${i + 1} = ${s}`).join('\n')}`;
        historialItem.appendChild(solucionesTexto);

        // Añadir el historial al contenedor
        historialDiv.appendChild(historialItem);
    });

    // Asegurar que el historial sea visible
    historialDiv.style.display = 'block';
}

function toggleHistorial() {
    const historialDiv = document.getElementById('historial');
    if (historialDiv.children.length === 0) {
        alert('No hay sistemas resueltos en el historial.');
        return;
    }

    if (historialDiv.style.display === 'none' || historialDiv.style.display === '') {
        historialDiv.style.display = 'block';
    } else {
        historialDiv.style.display = 'none';
    }
}

// Cargar el historial al iniciar la página
document.addEventListener('DOMContentLoaded', renderizarHistorial);
