// Verifica se o usuário está autenticado
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = '/login.html'; // Redireciona para a página de login
    }
}

// Chama a função ao carregar a página
checkAuthentication();



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
            },
            body: JSON.stringify({
                title,
                description,
                link,
                created_at
            })
        });

        if (response.ok) {
            alert('Vaga criada com sucesso!');
        } else {
            const data = await response.json();
            alert(data.error || 'Falha ao criar vaga');
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
            },
            body: JSON.stringify(updateData) // Envia apenas os campos que foram preenchidos
        });

        if (response.ok) {
            alert('Vaga atualizada com sucesso!');
        } else {
            const data = await response.json();
            alert(data.error || 'Falha ao atualizar a vaga');
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
        });

        if (response.ok) {
            alert('Vaga deletada com sucesso!');
        } else {
            const data = await response.json();
            alert(data.error || 'Falha ao deletar a vaga');
        }
    } catch (error) {
        console.error('Erro ao deletar a vaga:', error);
        alert('Erro ao deletar a vaga: ' + error.message);
    }
});
