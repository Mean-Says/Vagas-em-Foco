// Verifica se o usuário está autenticado
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = '/login.html'; // Redireciona para a página de login
    }
    return token;
}

// Chama a função ao carregar a página
const token = checkAuthentication();

document.getElementById('vagaForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const link = document.getElementById('link').value;
    const created_at = new Date().toISOString();  // Gera a data atual no formato ISO

    try {
        const response = await fetch('https://meansayss.pythonanywhere.com/api/make_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            },
            body: JSON.stringify({
                title,
                description,
                link,
                created_at
            })
        });

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            if (response.ok) {
                alert('Vaga criada com sucesso!');
            } else {
                console.error('Erro do servidor:', data);
                alert(`Falha ao criar vaga: ${data.error || data.ERROR || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Resposta não é JSON válido:', responseText);
            alert('Resposta do servidor não é JSON válido. Verifique o console para mais detalhes.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição: ' + error.message);
    }
});

// Função para atualizar uma vaga
document.getElementById('updateButton').addEventListener('click', async function () {
    // ... (código existente para atualização)
    // Lembre-se de adicionar o header de autorização aqui também
});

// Função para deletar uma vaga
document.getElementById('deleteButton').addEventListener('click', async function () {
    // ... (código existente para deleção)
    // Lembre-se de adicionar o header de autorização aqui também
});