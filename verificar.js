// --- CONFIGURACIÓN ---
// Reemplaza la variable que tengas por esta URL
const VERIFY_API_URL = 'https://8grx9hkg84.execute-api.us-east-1.amazonaws.com/v1/verify';



// --- ELEMENTOS DEL DOM ---
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');

// --- LÓGICA PRINCIPAL ---
window.addEventListener('load', async () => {
    // 1. Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        showError("Token no encontrado.", "Por favor, solicita un nuevo enlace de acceso.");
        return;
    }

    try {
        // 2. Llamar a la API de verificación
        const response = await fetch(VERIFY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'El token no es válido o ha expirado.');
        }

        // 3. ¡Éxito! Guardar el token de sesión (JWT)
        const sessionToken = data.session_token;
        localStorage.setItem('colpay_session_token', sessionToken);

        // 4. Redirigir al Dashboard
        showSuccess("¡Autenticación Exitosa!", "Redirigiendo a tu panel de control...");
        setTimeout(() => {
            window.location.href = '/dashboard.html'; // ¡Cambiamos a dashboard.html!
        }, 2000); // Espera 2 segundos antes de redirigir

    } catch (error) {
        showError("Error de Autenticación", error.message);
    }
});

// --- FUNCIONES AUXILIARES ---
function showError(title, text) {
    messageTitle.textContent = title;
    messageTitle.classList.remove('text-gray-800');
    messageTitle.classList.add('text-red-500');
    messageText.textContent = text;
}

function showSuccess(title, text) {
    messageTitle.textContent = title;
    messageTitle.classList.remove('text-gray-800');
    messageTitle.classList.add('text-green-500');
    messageText.textContent = text;
}
