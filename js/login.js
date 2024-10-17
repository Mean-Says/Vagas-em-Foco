document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://meansayss.pythonanywhere.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "username": username,
                "password": password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Verifique se a resposta contém o token de acesso
            if (data.access_token) {
                localStorage.setItem('token', data.access_token); // Armazena o token no localStorage
                window.location.href = '/admin.html'; // Redireciona para a página admin
            } else {
                throw new Error('Token não encontrado na resposta');
            }
        } else {
            // Se a resposta não for ok, exibe a mensagem de erro
            document.getElementById('error-message').innerText = data.error || data.msg || 'Erro ao fazer login';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('error-message').innerText = 'Erro na requisição: ' + error.message;
    }
});