// --- CONFIGURACIÓN ---
// Esta es la URL de nuestra primera función Lambda
const MAGIC_LINK_API_URL = 'https://yo2cm5zwp9.execute-api.us-east-1.amazonaws.com/default/MagicLink_Authentication';

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submit-button');
const messageArea = document.getElementById('message-area');

// --- LÓGICA ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const email = emailInput.value;

    // Deshabilitamos el botón para evitar múltiples envíos
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    messageArea.textContent = '';

    try {
        const response = await fetch(MAGIC_LINK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si la API devuelve un error (ej. 4xx, 5xx)
            throw new Error(data.message || 'Ocurrió un error. Inténtalo de nuevo.');
        }

        // ¡Éxito!
        document.getElementById('login-card').innerHTML = `
            <div class="text-center">
                <h1 class="text-2xl font-bold text-green-500 mb-4">¡Revisa tu Correo!</h1>
                <p class="text-gray-700">Hemos enviado un enlace mágico a <strong>${email}</strong>.</p>
                <p class="text-gray-500 mt-2">Sigue las instrucciones para acceder a tu panel de ColPay.</p>
            </div>
        `;

    } catch (error) {
        // Si hay un error de red o de la API
        messageArea.textContent = `Error: ${error.message}`;
        messageArea.classList.add('text-red-500');

        // Reactivamos el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión con Enlace Mágico';
    }
});
