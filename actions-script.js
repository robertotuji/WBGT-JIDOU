document.addEventListener('DOMContentLoaded', () => {

    // 1. Pega o parâmetro 'level' da URL da página
    const params = new URLSearchParams(window.location.search);
    const levelIndex = params.get('level'); // Ex: "0", "1", "2", etc.

    // 2. Detecta o idioma salvo pelo usuário na página principal
    // (Usaremos 'pt' como padrão se nada for encontrado)
    const lang = localStorage.getItem('wbgt-lang') || 'pt';
    
    // Define o idioma da página para acessibilidade
    document.documentElement.lang = lang;

    // 3. Encontra os locais na página onde o conteúdo será inserido
    const contentDiv = document.getElementById('actions-content');
    const backButton = document.getElementById('back-button');

    // 4. Verifica se temos as informações (nível e idioma) para construir a página
    if (levelIndex !== null && translations[lang]) {
        // Pega o conjunto de traduções para o idioma correto
        const t = translations[lang];

        // Pega os textos específicos para o nível de risco calculado
        const levelTitle = t.levels[levelIndex]; // Ex: "Alerta"
        const levelActionsKey = `actionsLevel${levelIndex}`; // Ex: "actionsLevel2"
        const levelActionsText = t[levelActionsKey]; // O parágrafo com as ações detalhadas

        // Cria o HTML que será inserido na página
        const htmlContent = `
            <h2>${t.actionsPageTitle}</h2>
            <div style="margin-top: -10px; margin-bottom: 20px; font-weight: bold; font-size: 1.2em; color: #00aaff;">
                ${levelTitle}
            </div>
            <div>${levelActionsText}</div>
        `;
        
        // Insere o conteúdo na página
        contentDiv.innerHTML = htmlContent;

        // Define o texto do botão "Voltar" no idioma correto
        backButton.textContent = t.backButton;
        
    } else {
        // Se houver um erro (ex: o link foi aberto sem o ?level=...), mostra uma mensagem de erro.
        contentDiv.innerHTML = '<p>Não foi possível carregar as informações. Por favor, volte à página principal e tente novamente.</p>';
        backButton.textContent = 'Voltar';
    }

    // Lógica para aplicar o modo escuro se ele estiver ativo
    if (localStorage.getItem('wbgt-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});