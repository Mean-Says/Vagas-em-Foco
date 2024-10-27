let currentPage = 1; // Página atual
const limit = 5; // Limite de vagas por requisição
let isLoading = false; // Para evitar múltiplas requisições ao mesmo tempo
const displayedJobIds = new Set(); // Conjunto para armazenar IDs de vagas exibidas

// Função para buscar vagas da API (com ou sem pesquisa)
async function fetchVagas(query = '', page = currentPage) {
    try {
        const url = query 
            ? `https://meansayss.pythonanywhere.com/api/search_jobs?search=${query}&page=${page}&limit=${limit}` 
            : `https://meansayss.pythonanywhere.com/api/get_jobs?page=${page}&limit=${limit}`;

        isLoading = true; // Indica que a requisição está em andamento
        const response = await fetch(url);
        const vagas = await response.json();
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
                    <div class="box">
                        <div class="model">
                            <div class="title_date">
                                <h2>${vaga.title}</h2>
                                <span><i>Postado em ${new Date(vaga.created_at).toLocaleDateString()}</i></span>
                            </div>
                            <p>${shortDescription.replace(/\n/g, '<br>')}</p> <!-- Renderiza a descrição com quebras de linha -->
                            <a href="/vaga.html?id=${vaga.id}">Ver mais</a> <!-- Link para a página de detalhes da vaga -->
                        </div>
                        
                    </div>

                `;
                vagasDiv.innerHTML += vagaElement;
            }
        });
    } catch (error) {
        console.error('Erro ao buscar vagas: ', error);
        document.querySelector('.vagasdiv').innerHTML += `<div class = "semVagas">
            <p>Erro ao carregar vagas. Tente novamente mais tarde.</p>
            </div>
        `;
    } finally {
        isLoading = false; // Define isLoading como false após a requisição
    }
}

// Função para buscar os tipos de trabalho mais comuns
async function fetchJobTypes() {
    try {
        const response = await fetch('https://meansayss.pythonanywhere.com/api/job_types');
        const jobTypes = await response.json();

        // Verifica se houve erro na resposta
        if (jobTypes.error) {
            console.error('Erro ao buscar tipos de trabalho:', jobTypes.error);
            return;
        }

        const jobTypesDiv = document.querySelector('.jobtypes'); // Div onde os tipos serão exibidos
        jobTypesDiv.innerHTML = "";
        jobTypes.forEach(type => {
            jobTypesDiv.innerHTML += `
                <a href="#" onclick="searchByJobType('${type.type}')">
                    ${type.type} 
                </a>
            `;
        });
    } catch (error) {
        console.error('Erro ao buscar tipos de trabalho:', error);
    }
}

// Função para buscar vagas com base no tipo de trabalho clicado
function searchByJobType(jobType) {
    currentPage = 1; // Reinicia a contagem de páginas
    document.querySelector('.vagasdiv').innerHTML = ''; // Limpa as vagas anteriores
    displayedJobIds.clear(); // Limpa o conjunto de IDs exibidos

    // Define o valor do campo de entrada com o item pesquisado
    const searchInput = document.querySelector('#searchInput'); // Seleciona o campo de entrada de pesquisa
    searchInput.value = jobType; // Atualiza o valor do campo de entrada

    // Realiza a pesquisa com o tipo de trabalho selecionado
    fetchVagas(jobType, currentPage);
}



// Função para lidar com a pesquisa de vagas
function handleSearch(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const searchInput = document.querySelector('#searchInput').value.trim();
    currentPage = 1; // Reinicia a contagem de páginas
    document.querySelector('.vagasdiv').innerHTML = ''; // Limpa as vagas anteriores
    displayedJobIds.clear(); // Limpa o conjunto de IDs exibidos
    fetchVagas(searchInput, currentPage); // Faz a busca com o termo digitado
}

// Função para verificar se o usuário rolou para o final da página
function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Se o usuário rolou até o final e não há requisição em andamento
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        currentPage++; // Incrementa a página
        fetchVagas('', currentPage); // Chama a função para buscar mais vagas
    }
}



// Inicializa as vagas e configura a funcionalidade de pesquisa
window.onload = function() {
    fetchVagas(); // Carrega as vagas ao iniciar a página
    fetchJobTypes();
    window.addEventListener('scroll', handleScroll); // Adiciona o evento de rolagem
    const searchForm = document.querySelector('#searchForm');
    searchForm.addEventListener('submit', handleSearch); // Adiciona o evento de busca ao formulário
};
