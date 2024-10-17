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
    const vagaId = document.getElementById('vagaId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const link = document.getElementById('link').value;

    if (!vagaId) {
        alert('Por favor, insira o ID da vaga que deseja atualizar.');
        return;
    }

    // Cria um objeto para armazenar apenas os campos que foram preenchidos
    const updateData = {};

    if (title) {
        updateData.title = title;
    }
    if (description) {
        updateData.description = description;
    }
    if (link) {
        updateData.link = link;
    }

    // Verifica se não há campos para atualizar
    if (Object.keys(updateData).length === 0) {
        alert('Por favor, preencha pelo menos um campo para atualizar.');
        return;
    }

    try {
        const response = await fetch(`https://meansayss.pythonanywhere.com/api/update_job/${vagaId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            },
            body: JSON.stringify(updateData) // Envia apenas os campos que foram preenchidos
        });

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            if (response.ok) {
                alert('Vaga atualizada com sucesso!');
            } else {
                console.error('Erro do servidor:', data);
                alert(`Falha ao atualizar a vaga: ${data.error || data.ERROR || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Resposta não é JSON válido:', responseText);
            alert('Resposta do servidor não é JSON válido. Verifique o console para mais detalhes.');
        }
    } catch (error) {
        console.error('Erro ao atualizar a vaga:', error);
        alert('Erro ao atualizar a vaga: ' + error.message);
    }
});

// Função para deletar uma vaga
document.getElementById('deleteButton').addEventListener('click', async function () {
    const vagaId = document.getElementById('vagaId').value;

    if (!vagaId) {
        alert('Por favor, insira o ID da vaga que deseja deletar.');
        return;
    }

    try {
        const response = await fetch(`https://meansayss.pythonanywhere.com/api/job/${vagaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            }
        });

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            if (response.ok) {
                alert('Vaga deletada com sucesso!');
            } else {
                console.error('Erro do servidor:', data);
                alert(`Falha ao deletar a vaga: ${data.error || data.ERROR || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Resposta não é JSON válido:', responseText);
            alert('Resposta do servidor não é JSON válido. Verifique o console para mais detalhes.');
        }
    } catch (error) {
        console.error('Erro ao deletar a vaga:', error);
        alert('Erro ao deletar a vaga: ' + error.message);
    }
});