let currentPage = 1; // Página atual
const limit = 5; // Limite de vagas por requisição
let isLoading = false; // Para evitar múltiplas requisições ao mesmo tempo
const displayedJobIds = new Set(); // Conjunto para armazenar IDs de vagas exibidas
let totalVagas = 0; // Armazenar o número total de vagas retornado pela API

// Função para buscar vagas da API (com ou sem pesquisa)
async function fetchVagas(query = '', page = currentPage) {
    try {
        const url = query 
            ? `https://meansayss.pythonanywhere.com/api/search_jobs?search=${query}&page=${page}&limit=${limit}` 
            : `https://meansayss.pythonanywhere.com/api/get_jobs?page=${page}&limit=${limit}`;

        isLoading = true; // Indica que a requisição está em andamento
        const response = await fetch(url);
        const data = await response.json();  // A resposta agora contém `total_vagas` e `vagas`
        const vagas = data.vagas;
        totalVagas = data.total_vagas; // Atualiza o total de vagas

        const vagasDiv = document.querySelector('.vagasdiv');

        // Verifica se houve erro na busca
        if (vagas.error) {
            vagasDiv.innerHTML += `<p>${vagas.error}</p>`;
            return;
        }

        // Renderiza as vagas encontradas
        vagas.forEach(vaga => {
            if (!displayedJobIds.has(vaga.id)) { // Verifica se a vaga já foi exibida
                displayedJobIds.add(vaga.id); // Adiciona o ID ao conjunto
                const shortDescription = vaga.description.length > 100 
                    ? vaga.description.substring(0, 100) + '...' 
                    : vaga.description; // Limita a descrição a 100 caracteres

                const vagaElement = `
                    <div class="model">
                        <div class="title_date">
                            <h2>${vaga.title}</h2>
                            <span><i> Postado em ${new Date(vaga.created_at).toLocaleDateString()}</i></span>
                        </div>
                        <p>${shortDescription.replace(/\n/g, '<br>')}</p> <!-- Renderiza a descrição com quebras de linha -->
                        <a href="/vaga.html?id=${vaga.id}">Ver mais</a> <!-- Link para a página de detalhes da vaga -->
                    </div>
                `;
                vagasDiv.innerHTML += vagaElement;
            }
        });

        // Verifica se todas as vagas foram carregadas
        if (displayedJobIds.size >= totalVagas) {
            window.removeEventListener('scroll', handleScroll); // Remove o evento de rolagem se todas as vagas foram carregadas
        }
        
    } catch (error) {
        console.error('Erro ao buscar vagas: ', error);
        document.querySelector('.vagasdiv').innerHTML += `<div class="semVagas">
            <p>Erro ao carregar vagas. Tente novamente mais tarde.</p>
            </div>
        `;
    } finally {
        isLoading = false; // Define isLoading como false após a requisição
    }
}

// Função para verificar se o usuário rolou para o final da página
function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Se o usuário rolou até o final e não há requisição em andamento
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        currentPage++; // Incrementa a página

        // Se já carregamos todas as vagas, não faz mais requisições
        if (displayedJobIds.size < totalVagas) {
            fetchVagas('', currentPage); // Chama a função para buscar mais vagas
        }
    }
}
