// Se ejecuta cuando todo el contenido del HTML ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener el JWT del Local Storage y definir elementos del DOM
    const token = localStorage.getItem('colpay_session_token');
    const addStudentForm = document.getElementById('add-student-form');
    const registrationCodeInput = document.getElementById('registration-code');
    const addStudentButton = document.getElementById('add-student-button');
    const addStudentMessage = document.getElementById('add-student-message');

    // Si no hay token, el usuario no está autenticado. Lo redirigimos al login.
    if (!token) {
        console.error('No se encontró el token de sesión. Redirigiendo al login.');
        window.location.href = '/index.html';
        return;
    }

    // 2. Definir la URL de nuestra API para obtener datos
    const apiUrl = 'https://gu4200w067.execute-api.us-east-1.amazonaws.com/default/GetDashboardData';

    // 3. Llamar a la API para obtener los datos del dashboard
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('colpay_session_token');
                    window.location.href = '/index.html';
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos del backend:', data);
            renderDashboard(data);
        })
        .catch(error => {
            console.error('Error al obtener los datos del dashboard:', error);
            const container = document.getElementById('student-cards-container');
            container.innerHTML = `<p class="text-red-500 text-center col-span-full">No se pudieron cargar los datos. Por favor, intenta iniciar sesión de nuevo.</p>`;
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
        container.innerHTML = ''; // Limpiamos el mensaje de "cargando..."

        if (data.estudiantes && data.estudiantes.length > 0) {
            data.estudiantes.forEach(student => {
                // Creamos el HTML para la tarjeta de cada estudiante, ahora como un enlace.
                const card = `
                    <a href="student-details.html?id=${student.idEstudiante}" class="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow no-underline">
                        <h3 class="text-lg font-bold text-indigo-600">${student.nombreCompleto}</h3>
                        <p class="text-gray-600">ID: ${student.idEstudiante}</p>
                        <p class="text-gray-500">${student.grado} - Grupo ${student.grupo}</p>
                    </a>
                `;
                // Insertamos la tarjeta en el contenedor
                container.innerHTML += card;
            });
        } else {
            container.innerHTML = `<p class="text-gray-500 col-span-full">No tienes estudiantes asociados todavía.</p>`;
        }
    }

    // --- Lógica para el formulario de Añadir Estudiante ---
    addStudentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const registrationCode = registrationCodeInput.value;
        if (!registrationCode) {
            addStudentMessage.textContent = 'Por favor, introduce un código.';
            addStudentMessage.className = 'mt-4 font-medium text-red-500';
            return;
        }

        addStudentButton.disabled = true;
        addStudentButton.textContent = 'Añadiendo...';
        addStudentMessage.textContent = '';

        try {
            // **AQUÍ IRÁ LA LLAMADA A LA NUEVA LAMBDA 'RegisterStudent'**
            console.log('--- SIMULANDO LLAMADA A LA API ---');
            console.log('URL de la API a llamar (cuando la tengamos): [URL_DE_REGISTER_STUDENT]');
            console.log('Método: POST');
            console.log('Token de Sesión (JWT):', token);
            console.log('Cuerpo de la petición (Body):', JSON.stringify({ registrationCode: registrationCode }));
            console.log('------------------------------------');

            await new Promise(resolve => setTimeout(resolve, 1500));

            addStudentMessage.textContent = `¡Estudiante añadido con éxito! Recargando la lista...`;
            addStudentMessage.className = 'mt-4 font-medium text-green-600';

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error al añadir estudiante:', error);
            addStudentMessage.textContent = `Error: ${error.message}`;
            addStudentMessage.className = 'mt-4 font-medium text-red-500';

            addStudentButton.disabled = false;
            addStudentButton.textContent = 'Añadir Estudiante';
        }
    });

}); // <-- FIN DEL 'DOMContentLoaded'


