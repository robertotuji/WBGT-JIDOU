document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DO DOM ---
    const temperatureInput = document.getElementById("temperature");
    const humidityInput = document.getElementById("humidity");
    const calculateButton = document.getElementById("calculate");
    const clearButton = document.getElementById("clear");
    const getLocationWeatherButton = document.getElementById('get-location-weather');
    const languageSelector = document.getElementById("language");
    const darkModeToggle = document.getElementById("dark-mode");

    const resultBox = document.getElementById("result-box");
    const resultDiv = document.getElementById("result");
    const errorMessageBox = document.getElementById("error-message-box");
    const errorMessageDiv = document.getElementById("error-message");
    
    const mainTitleElement = document.getElementById('main-title');
    const subTitleElement = document.getElementById('sub-title');
    const locationDisplay = document.getElementById('location-display');
    const lastUpdatedDisplay = document.getElementById('last-updated-display');

    // --- TRADUÇÕES E CONFIGURAÇÕES ---
    const translations = {
        ja: {
            titleMain: "WBGT",
            titleSub: "チェッカー（ロケーション）",
            labelTemp: "気温(°C) 乾球温度:",
            labelHumidity: "湿度 (%):",
            calculate: "計算",
            clear: "クリア",
            dark: "ダークモード",
            invalidInput: "有効な温度と湿度を入力してください。",
            tempOutOfRange: "温度は21°Cから40°Cの間である必要があります。",
            humOutOfRange: "相対湿度は20%から100%の間である必要があります。",
            getLocationWeather: "現在の位置の天気を取得",
            locationPermissionDenied: "位置情報へのアクセスが拒否されました。",
            locationNotAvailable: "位置情報が利用できません。",
            locationTimeout: "位置情報の取得がタイムアウトしました。",
            fetchError: "気象データの取得中にエラーが発生しました。",
            apiKeyNotConfigured: "APIキーが設定されていません。",
            manualLabel: "または手動で入力:",
            locationDisplayPrefix: "場所:",
            lastUpdatedPrefix: "最終更新:",
            levels: ["ほぼ安全", "注意", "警戒", "厳重警戒", "危険"]
        },
        pt: {
            titleMain: "WBGT",
            titleSub: "Verificador (Localização)",
            labelTemp: "Temperatura (°C) Bulbo Seco:",
            labelHumidity: "Umidade (%):",
            calculate: "Calcular",
            clear: "Limpar",
            dark: "Modo Escuro",
            invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
            tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C.",
            humOutOfRange: "A umidade deve estar entre 20% e 100%.",
            getLocationWeather: "Obter Clima da Localização Atual",
            locationPermissionDenied: "Permissão de localização negada.",
            locationNotAvailable: "Localização não disponível.",
            locationTimeout: "Tempo esgotado para obter a localização.",
            fetchError: "Erro ao buscar dados do clima.",
            apiKeyNotConfigured: "Chave da API não configurada.",
            manualLabel: "Ou insira manualmente:",
            locationDisplayPrefix: "Local:",
            lastUpdatedPrefix: "Última atualização:",
            levels: ["Quase Seguro", "Atenção", "Alerta", "Alerta Máximo", "Perigo"]
        },
        en: {
            titleMain: "WBGT",
            titleSub: "Checker (Location)",
            labelTemp: "Temperature (°C) Dry Bulb:",
            labelHumidity: "Humidity (%):",
            calculate: "Calculate",
            clear: "Clear",
            dark: "Dark Mode",
            invalidInput: "Please enter valid Temperature and Humidity.",
            tempOutOfRange: "Temperature must be between 21°C and 40°C.",
            humOutOfRange: "Humidity must be between 20% and 100%.",
            getLocationWeather: "Get Current Location Weather",
            locationPermissionDenied: "Location permission denied.",
            locationNotAvailable: "Location not available.",
            locationTimeout: "Location request timed out.",
            fetchError: "Error fetching weather data.",
            apiKeyNotConfigured: "API key not configured.",
            manualLabel: "Or enter manually:",
            locationDisplayPrefix: "Location:",
            lastUpdatedPrefix: "Last updated:",
            levels: ["Almost Safe", "Caution", "Warning", "High Alert", "Danger"]
        },
        id: {
            titleMain: "WBGT",
            titleSub: "Pemeriksa (Lokasi)",
            labelTemp: "Suhu (°C) Bola Kering:",
            labelHumidity: "Kelembaban (%):",
            calculate: "Hitung",
            clear: "Bersihkan",
            dark: "Mode Gelap",
            invalidInput: "Masukkan Suhu dan Kelembaban yang valid.",
            tempOutOfRange: "Suhu harus antara 21°C dan 40°C.",
            humOutOfRange: "Kelembaban harus antara 20% dan 100%.",
            getLocationWeather: "Dapatkan Cuaca Lokasi Saat Ini",
            locationPermissionDenied: "Izin lokasi ditolak.",
            locationNotAvailable: "Informasi lokasi tidak tersedia.",
            locationTimeout: "Permintaan lokasi habis waktu.",
            fetchError: "Gagal mengambil data cuaca.",
            apiKeyNotConfigured: "Kunci API tidak dikonfigurasi.",
            manualLabel: "Atau masukkan manual:",
            locationDisplayPrefix: "Lokasi:",
            lastUpdatedPrefix: "Diperbarui:",
            levels: ["Hampir Aman", "Waspada", "Siaga", "Siaga Tinggi", "Bahaya"]
        }
    };
    
    // ATENÇÃO: É INSEGURO MANTER A CHAVE DA API AQUI.
    // O ideal é usar um servidor backend para fazer a chamada à API.
    const OPENWEATHER_API_KEY = "ef9a9484e8ec68d8909"; // Sua chave da OpenWeatherMap
    const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    let wbgtData = {};

    // --- FUNÇÕES ---

    function updateLanguage() {
        const lang = languageSelector.value;
        const t = translations[lang];

        mainTitleElement.textContent = t.titleMain;
        subTitleElement.textContent = t.titleSub;
        document.getElementById('label-temp').textContent = t.labelTemp;
        document.getElementById('label-humidity').textContent = t.labelHumidity;
        calculateButton.textContent = t.calculate;
        clearButton.textContent = t.clear;
        getLocationWeatherButton.textContent = t.getLocationWeather;
        document.getElementById('manual-label').textContent = t.manualLabel;
        document.getElementById('dark-label').textContent = t.dark;
        document.title = `${t.titleMain} ${t.titleSub}`;
    }

    async function loadWbgtData() {
        try {
            const response = await fetch('/WBGT-JIDOU/wbgt_table_preciso.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            wbgtData = await response.json();
            console.log("Dados WBGT carregados com sucesso!");
        } catch (error) {
            console.error("Erro ao carregar os dados WBGT:", error);
            displayError("Falha ao carregar dados essenciais do aplicativo.");
        }
    }

    function displayError(message) {
        resultBox.classList.add("hidden");
        errorMessageBox.classList.remove("hidden");
        errorMessageDiv.innerHTML = message;
    }

    function hideError() {
        errorMessageBox.classList.add("hidden");
        errorMessageDiv.innerHTML = "";
    }

    function clearResults() {
        hideError();
        resultBox.classList.add("hidden");
        temperatureInput.value = "";
        humidityInput.value = "";
        locationDisplay.textContent = "";
        lastUpdatedDisplay.textContent = "";
        getLocationWeatherButton.classList.remove('active');
        temperatureInput.focus();
    }
    
    function getWbgtLevel(wbgt) {
        if (wbgt < 21) return { levelIdx: 0, color: "#D3EAFB" }; // Quase Seguro
        if (wbgt < 25) return { levelIdx: 1, color: "#FFFF00" }; // Atenção
        if (wbgt < 28) return { levelIdx: 2, color: "#FFC000" }; // Alerta
        if (wbgt < 31) return { levelIdx: 3, color: "#FF0000" }; // Alerta Máximo
        return { levelIdx: 4, color: "#538DD5" }; // Perigo
    }

    function calculateFromInputs() {
        hideError();
        const temp = parseFloat(temperatureInput.value);
        const hum = parseFloat(humidityInput.value);
        const lang = languageSelector.value;

        if (isNaN(temp) || isNaN(hum)) {
            displayError(translations[lang].invalidInput);
            return;
        }
        if (temp < 21 || temp > 40) {
            displayError(translations[lang].tempOutOfRange);
            return;
        }
        if (hum < 20 || hum > 100) {
            displayError(translations[lang].humOutOfRange);
            return;
        }
        
        const wbgt = getWbgtValueInterpolated(temp, hum);
        if (wbgt === null) {
            displayError(translations[lang].invalidInput); // Fallback error
            return;
        }

        const { levelIdx, color } = getWbgtLevel(wbgt);
        const label = translations[lang].levels[levelIdx];
        
        resultBox.classList.remove("hidden");
        resultBox.style.backgroundColor = color;

        if (color === "#FF0000" || color === "#538DD5") {
            resultDiv.style.color = "white";
        } else {
            resultDiv.style.color = "black";
        }

        resultDiv.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
    }
    
    // --- LÓGICA DE INTERPOLAÇÃO (SEM ALTERAÇÕES) ---
    function interpolate(x, x0, y0, x1, y1) {
        if (x1 === x0) return y0;
        return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    }

    function getWbgtValueInterpolated(temp, hum) {
        const temps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
        const hums = Object.keys(wbgtData[temps[0]]).map(Number).sort((a, b) => a - b);

        let t0_val = temps.filter(t => t <= temp).pop();
        let t1_val = temps.filter(t => t >= temp)[0];
        let h0_val = hums.filter(h => h <= hum).pop();
        let h1_val = hums.filter(h => h >= hum)[0];

        const wbgt_t0_h0 = parseFloat(wbgtData[String(t0_val)][String(h0_val)]);
        const wbgt_t0_h1 = parseFloat(wbgtData[String(t0_val)][String(h1_val)]);
        const wbgt_t1_h0 = parseFloat(wbgtData[String(t1_val)][String(h0_val)]);
        const wbgt_t1_h1 = parseFloat(wbgtData[String(t1_val)][String(h1_val)]);

        const f_t_h0 = interpolate(temp, t0_val, wbgt_t0_h0, t1_val, wbgt_t1_h0);
        const f_t_h1 = interpolate(temp, t0_val, wbgt_t0_h1, t1_val, wbgt_t1_h1);
        
        const wbgt_interp = interpolate(hum, h0_val, f_t_h0, h1_val, f_t_h1);
        
        return Math.round(wbgt_interp);
    }
    
    // --- LÓGICA DE GEOLOCALIZAÇÃO E API ---
    async function getGeolocationAndFetchWeather() {
        clearResults();
        const lang = languageSelector.value;

        if (!OPENWEATHER_API_KEY) {
            displayError(translations[lang].apiKeyNotConfigured);
            return;
        }

        getLocationWeatherButton.classList.add('active');
        
        if (!navigator.geolocation) {
            displayError("Seu navegador não suporta geolocalização.");
            getLocationWeatherButton.classList.remove('active');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherDataByCoords(latitude, longitude);
            },
            (error) => {
                const lang = languageSelector.value;
                let msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED: msg = translations[lang].locationPermissionDenied; break;
                    case error.POSITION_UNAVAILABLE: msg = translations[lang].locationNotAvailable; break;
                    case error.TIMEOUT: msg = translations[lang].locationTimeout; break;
                    default: msg = translations[lang].fetchError; break;
                }
                displayError(msg);
                getLocationWeatherButton.classList.remove('active');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    async function fetchWeatherDataByCoords(lat, lon) {
        const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const lang = languageSelector.value;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na API');
            }

            const { temp, humidity } = data.main;
            const cityName = data.name;
            const countryCode = data.sys.country;
            const date = new Date(data.dt * 1000);

            locationDisplay.textContent = `${translations[lang].locationDisplayPrefix} ${cityName}, ${countryCode}`;
            lastUpdatedDisplay.textContent = `${translations[lang].lastUpdatedPrefix} ${date.toLocaleTimeString()}`;
            temperatureInput.value = temp.toFixed(1);
            humidityInput.value = humidity;

            calculateFromInputs(); // Calcula o WBGT com os dados recebidos

        } catch (error) {
            displayError(`${translations[lang].fetchError} (${error.message})`);
        } finally {
            getLocationWeatherButton.classList.remove('active');
        }
    }


    // --- INICIALIZAÇÃO E EVENT LISTENERS ---

    // Define o modo escuro com base na preferência do sistema ou salvo anteriormente
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('darkMode') !== 'disabled')) {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }
    
    // Altera o tema quando o toggle é clicado
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Adiciona os "escutadores" de eventos aos botões
    calculateButton.addEventListener("click", calculateFromInputs);
    clearButton.addEventListener("click", clearResults);
    languageSelector.addEventListener("change", updateLanguage);
    getLocationWeatherButton.addEventListener("click", getGeolocationAndFetchWeather);

    // Carrega os dados e define o idioma inicial
    loadWbgtData().then(() => {
        updateLanguage();
    });
});
