document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const levelIndex = params.get('level');
    const lang = localStorage.getItem('wbgt-lang') || 'pt';
    document.documentElement.lang = lang;
    const contentDiv = document.getElementById('actions-content');
    const backButton = document.getElementById('back-button');
    if (levelIndex !== null && translations[lang]) {
        const t = translations[lang];
        const levelTitle = t.levels[levelIndex];
        const levelActionsKey = `actionsLevel${levelIndex}`;
        const levelActionsText = t[levelActionsKey];
        const htmlContent = `
            <h2>${t.actionsPageTitle}</h2>
            <div style="margin-top: -10px; margin-bottom: 20px; font-weight: bold; font-size: 1.2em; color: #00aaff;">
                ${levelTitle}
            </div>
            <div>${levelActionsText}</div>
        `;
        contentDiv.innerHTML = htmlContent;
        backButton.textContent = t.backButton;
    } else {
        contentDiv.innerHTML = '<p>Não foi possível carregar as informações. Por favor, volte à página principal e tente novamente.</p>';
        backButton.textContent = 'Voltar';
    }
    if (localStorage.getItem('wbgt-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});
