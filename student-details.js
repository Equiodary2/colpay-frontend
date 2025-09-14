// Se ejecuta cuando todo el contenido del HTML ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    // ¡NUEVA URL! Esta es la URL de nuestra Lambda GetStudentDetails
    const GET_DETAILS_API_URL = 'https://ilc7n2nf5xharcinet22j33umm0pyizf.lambda-url.us-east-1.on.aws/';

    // --- OBTENCIÓN DE DATOS INICIALES ---
    const token = localStorage.getItem('colpay_session_token');
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    // --- ELEMENTOS DEL DOM ---
    const studentNameDisplay = document.getElementById('student-name');
    const studentIdDisplay = document.getElementById('student-id-display');
    const detailsContainer = document.getElementById('details-container');
    const loadingSpinner = document.getElementById('loading-details-spinner');

    // --- LÓGICA PRINCIPAL ---

    // 1. Validar que tenemos todo lo necesario para empezar
    if (!token) {
        window.location.href = '/index.html'; // Si no hay sesión, fuera.
        return;
    }

    if (!studentId) {
        showError("Error: No se ha especificado un estudiante.");
        return;
    }

    // 2. Llamar a la API para obtener los detalles del estudiante
    fetch(`${GET_DETAILS_API_URL}?studentId=${studentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                // Si el token es inválido, lo borramos y redirigimos.
                if (response.status === 401) {
                    localStorage.removeItem('colpay_session_token');
                    window.location.href = '/index.html';
                }
                // Lanzamos el error para que lo capture el .catch()
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then(data => {
            // 3. ¡Éxito! Tenemos los datos, vamos a pintarlos.
            console.log('Detalles del estudiante recibidos:', data);
            renderStudentDetails(data);
        })
        .catch(error => {
            console.error('Error al obtener los detalles del estudiante:', error);
            showError(`Error al cargar los datos: ${error.message}`);
        });
});

/**
 * Función para renderizar los detalles del estudiante en el HTML.
 * @param {object} studentData - Los datos del estudiante recibidos de la API.
 */
function renderStudentDetails(studentData) {
    const studentNameDisplay = document.getElementById('student-name');
    const studentIdDisplay = document.getElementById('student-id-display');
    const loadingSpinner = document.getElementById('loading-details-spinner');

    // Actualizamos los campos con los datos reales
    studentNameDisplay.textContent = studentData.nombreCompleto;
    studentIdDisplay.textContent = `ID del Estudiante: ${studentData.idEstudiante}`;

    // Ocultamos el spinner de "cargando"
    loadingSpinner.style.display = 'none';

    // --- TAREAS FUTURAS ---
    // Aquí renderizaríamos las secciones de facturas y pagos
    // Por ejemplo: renderInvoices(studentData.invoices);
}

/**
 * Función para mostrar un mensaje de error en la página.
 * @param {string} message - El mensaje de error a mostrar.
 */
function showError(message) {
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
        <h1 class="text-2xl font-bold text-red-500">Error</h1>
        <p class="text-gray-600">${message}</p>
    `;
}
