// Se ejecuta cuando todo el contenido del HTML ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener el JWT del Local Storage
    const token = localStorage.getItem('colpay_session_token');

    // Si no hay token, el usuario no está autenticado. Lo redirigimos al login.
    if (!token) {
        console.error('No se encontró el token de sesión. Redirigiendo al login.');
        window.location.href = '/index.html';
        return;
    }

    // 2. Definir la URL de nuestra API
    const apiUrl = 'https://8grx9hkg84.execute-api.us-east-1.amazonaws.com/dashboard';

    // 3. Llamar a la API usando fetch
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            // ¡Este es el paso clave! Enviamos el JWT para autenticarnos.
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            // Si la respuesta no es "OK" (ej: 401, 404, 500), lanzamos un error.
            if (!response.ok) {
                // Si el token es inválido o expiró (401), lo borramos y redirigimos.
                if (response.status === 401) {
                    localStorage.removeItem('colpay_session_token');
                    window.location.href = '/index.html';
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }
            // Convertimos la respuesta a JSON
            return response.json();
        })
        .then(data => {
            // 4. ¡Éxito! Tenemos los datos. Ahora los "pintamos" en el HTML.
            console.log('Datos recibidos del backend:', data);
            renderDashboard(data);
        })
        .catch(error => {
            // Si algo falla en el proceso, lo mostramos en la consola.
            console.error('Error al obtener los datos del dashboard:', error);
            // Mostramos un mensaje de error al usuario en la página.
            const container = document.getElementById('student-cards-container');
            container.innerHTML = `<p class="text-red-500 text-center col-span-full">No se pudieron cargar los datos. Por favor, intenta iniciar sesión de nuevo.</p>`;
        });
});

/**
 * Función para renderizar los datos del dashboard en el HTML.
 * @param {object} data - El objeto JSON recibido de la API.
 */
function renderDashboard(data) {
    // Renderizar datos del usuario
    const userGreeting = document.getElementById('user-greeting');
    const userEmail = document.getElementById('user-email');

    if (data.usuario && data.usuario.nombreCompleto) {
        userGreeting.textContent = `¡Hola, ${data.usuario.nombreCompleto}!`;
        userEmail.textContent = `Sesión iniciada como: ${data.usuario.email}`;
    }

    // Renderizar tarjetas de estudiantes
    const container = document.getElementById('student-cards-container');
    // Limpiamos el mensaje de "cargando..."
    container.innerHTML = '';

    if (data.estudiantes && data.estudiantes.length > 0) {
        data.estudiantes.forEach(student => {
            // Creamos el HTML para la tarjeta de cada estudiante
            const card = `
                <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h3 class="text-lg font-bold text-indigo-600">${student.nombreCompleto}</h3>
                    <p class="text-gray-600">ID: ${student.idEstudiante}</p>
                    <p class="text-gray-500">${student.grado} - Grupo ${student.grupo}</p>
                </div>
            `;
            // Insertamos la tarjeta en el contenedor
            container.innerHTML += card;
        });
    } else {
        // Si no hay estudiantes, mostramos un mensaje.
        container.innerHTML = `<p class="text-gray-500 col-span-full">No tienes estudiantes asociados todavía.</p>`;
    }
}
