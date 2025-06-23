const translations = {
    ja: {
        titleMain: "WBGT",
        titleSub: "チェッカー（ロケーション）",
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
        tempOutOfRange: "WBGTテーブルに値が記録されていないため、温度は21°Cから40°Cの間である必要があります。",
        humOutOfRange: "WBGTテーブルに値が記録されていないため、相対湿度は20%から100%の間である必要があります。",
        getLocationWeather: "現在の位置の天気を取得",
        locationPermissionDenied: "位置情報へのアクセスが拒否されました。設定で許可してください。",
        locationNotAvailable: "位置情報が利用できません。",
        locationTimeout: "位置情報の取得がタイムアウトしました。もう一度お試しください。",
        fetchError: "気象データの取得中にエラーが発生しました。",
        apiKeyNotConfigured: "APIキーが設定されていません。script.jsを確認してください。",
        manualLabel: "または手動で入力:",
        locationDisplayPrefix: "場所:",
        lastUpdatedPrefix: "最終更新:",
        levels: [
            "ほぼ安全",
            "注意",
            "警戒",
            "厳重警戒",
            "危険"
        ]
    },
    pt: {
        titleMain: "WBGT",
        titleSub: "Verificador (Localização)",
        temperature: "Temperatura (°C) Temperatura de Bulbo Seco:",
        humidity: "Umidade (%):",
        calculate: "Calcular",
        clear: "Limpar",
        dark: "Modo Escuro",
        invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
        tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C, pois fora desses limites não há valores registrados na tabela WBGT.",
        humOutOfRange: "A umidade relativa deve estar entre 20% e 100%, pois fora desses limites não há valores registrados na tabela WBGT.",
        getLocationWeather: "Obter Clima da Localização Atual",
        locationPermissionDenied: "Permissão de localização negada. Por favor, habilite nas configurações do seu dispositivo.",
        locationNotAvailable: "Localização não disponível.",
        locationTimeout: "Tempo esgotado para obter a localização. Por favor, tente novamente.",
        fetchError: "Erro ao buscar dados do clima. Por favor, tente novamente mais tarde.",
        apiKeyNotConfigured: "Por favor, configure sua chave de API da OpenWeatherMap no script.js.",
        manualLabel: "Ou insira manualmente:",
        locationDisplayPrefix: "Local:",
        lastUpdatedPrefix: "Última atualização:",
        levels: [
            "Quase Seguro",
            "Atenção",
            "Alerta",
            "Alerta Máximo",
            "Perigo"
        ]
    },
    en: {
        titleMain: "WBGT",
        titleSub: "Checker (Location)",
        temperature: "Temperature (°C)Dry Bulb Temperature:",
        humidity: "Humidity (%):",
        calculate: "Calculate",
        clear: "Clear",
        dark: "Dark Mode",
        invalidInput: "Please enter valid Temperature and Humidity values.",
        tempOutOfRange: "Temperature must be between 21°C and 40°C, as there are no recorded values outside these limits in the WBGT table.",
        humOutOfRange: "Relative humidity must be between 20% and 100%, as there are no recorded values outside these limits in the WBGT table.",
        getLocationWeather: "Get Current Location Weather",
        locationPermissionDenied: "Location permission denied. Please enable in your device settings.",
        locationNotAvailable: "Location information not available.",
        locationTimeout: "The request to get user location timed out. Please try again.",
        fetchError: "Error fetching weather data. Please try again later.",
        apiKeyNotConfigured: "Please configure your OpenWeatherMap API key in script.js.",
        manualLabel: "Or enter manually:",
        locationDisplayPrefix: "Location:",
        lastUpdatedPrefix: "Last updated:",
        levels: [
            "Almost Safe",
            "Caution",
            "Warning",
            "High Alert",
            "Danger"
        ]
    },
    id: {
        titleMain: "WBGT",
        titleSub: "Pemeriksa (Lokasi)",
        temperature: "Suhu (°C) Suhu Bola Kering:",
        humidity: "Kelembaban (%):",
        calculate: "Hitung",
        clear: "Bersihkan",
        dark: "Mode Gelap",
        invalidInput: "Mohon masukkan nilai Suhu dan Kelembaban yang valid.",
        tempOutOfRange: "Suhu harus antara 21°C dan 40°C, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        humOutOfRange: "Kelembaban relatif harus antara 20% dan 100%, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        getLocationWeather: "Dapatkan Cuaca Lokasi Saat Ini",
        locationPermissionDenied: "Izin lokasi ditolak. Harap aktifkan di pengaturan perangkat Anda.",
        locationNotAvailable: "Informasi lokasi tidak tersedia.",
        locationTimeout: "Permintaan untuk mendapatkan lokasi pengguna telah habis waktu. Silakan coba lagi.",
        fetchError: "Terjadi kesalahan saat mengambil data cuaca.",
        apiKeyNotConfigured: "Mohon konfigurasikan kunci API OpenWeatherMap Anda di script.js.",
        manualLabel: "Atau masukkan secara manual:",
        lastUpdatedPrefix: "Terakhir diperbarui:",
        levels: [
            "Hampir Aman",
            "Waspada",
            "Siaga",
            "Siaga Tinggi",
            "Bahaya"
        ]
    }
};

// ** CHAVE DE API DA OPENWEATHERMAP AQUI **
const OPENWEATHER_API_KEY = "ef9a9484e8ec68d8909"; // Sua chave da OpenWeatherMap
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"; // URL da OpenWeatherMap


const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector('.container');
const manualLabel = document.getElementById('manual-label');
const locationDisplay = document.getElementById('location-display');
const lastUpdatedDisplay = document.getElementById('last-updated-display'); 
const getLocationWeatherButton = document.getElementById('get-location-weather');

const mainTitleElement = document.getElementById('main-title'); 
const subTitleElement = document.getElementById('sub-title');


let wbgtData = {};

async function loadWbgtData() {
    try {
        const response = await fetch('/WBGT-JIDOU/wbgt_table_preciso.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        wbgtData = await response.json();
        console.log("Dados WBGT carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar os dados WBGT:", error);
        alert("Erro ao carregar a tabela de WBGT. Por favor, tente novamente mais tarde.");
    }
}

loadWbgtData();

function displayError(message) {
    resultBox.classList.add("hidden");
    if (locationDisplay) locationDisplay.textContent = "";
    if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = "";
    getLocationWeatherButton.classList.remove('active');
    errorMessageBox.classList.remove("hidden");
    errorMessage.innerHTML = message;
}

function hideError() {
    errorMessageBox.classList.add("hidden");
    errorMessage.innerHTML = "";
    if (locationDisplay) locationDisplay.textContent = "";
    if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = "";
    getLocationWeatherButton.classList.remove('active');
}

async function getGeolocationAndFetchWeather() {
    hideError(); // Limpa erros e resultados anteriores
    resultBox.classList.add("hidden");

    if (!OPENWEATHER_API_KEY) { // Usando a chave da OpenWeatherMap
        displayError(translations[document.getElementById("language").value].apiKeyNotConfigured); 
        console.error("API Key OpenWeatherMap não configurada ou inválida.");
        return;
    }

    console.log("Clicado no botão 'Obter Clima da Localização Atual'. Tentando obter geolocalização...");
    getLocationWeatherButton.classList.add('active'); // Define o botão como ativo no início da tentativa
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("Geolocalização obtida:", position.coords.latitude, position.coords.longitude);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await fetchWeatherDataByCoords(lat, lon);
            },
            (error) => {
                const lang = document.getElementById("language").value;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        displayError(translations[lang].locationPermissionDenied);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        displayError(translations[lang].locationNotAvailable);
                        break;
                    case error.TIMEOUT:
                        displayError(translations[lang].locationTimeout);
                        break;
                    case error.UNKNOWN_ERROR:
                        displayError(translations[lang].fetchError);
                        break;
                }
                console.error("Erro de geolocalização:", error);
                getLocationWeatherButton.classList.remove('active'); // Remove a classe 'active' em caso de erro
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        displayError("Seu navegador não suporta geolocalização.");
        console.error("Geolocation is not supported by this browser.");
        getLocationWeatherButton.classList.remove('active');
    }
}

async function fetchWeatherDataByCoords(lat, lon) {
    // ** Chamada à API da OpenWeatherMap **
    const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`; // API da OpenWeatherMap

    console.log("Fetching weather from URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
            if (data.main && data.main.temp !== undefined && data.main.humidity !== undefined && data.name && data.sys && data.sys.country && data.dt !== undefined) {
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                const cityName = data.name;
                const countryCode = data.sys.country;

                const lang = document.getElementById("language").value;
                if (locationDisplay) locationDisplay.textContent = `${translations[lang].locationDisplayPrefix} ${cityName}, ${countryCode}`;
                
                const date = new Date(data.dt * 1000);
                const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
                const formattedTime = date.toLocaleTimeString(document.getElementById("language").value, options);
                if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = `${translations[lang].lastUpdatedPrefix} ${formattedTime}`;

                console.log(`DEBUG: Localizacao definida na UI: ${cityName}, ${countryCode}`);
                console.log(`DEBUG: Última atualização definida na UI: ${formattedTime}`);

                document.getElementById("temperature").value = temp.toFixed(1);
                document.getElementById("humidity").value = humidity;

                const { wbgt, levelIdx, color } = calculateWBGT(temp, humidity);

                if (wbgt === null || isNaN(wbgt)) {
                    resultBox.classList.add("hidden");
                } else {
                    const label = translations[lang].levels[levelIdx];
                    resultBox.classList.remove("hidden");
                    resultBox.style.backgroundColor = color;
                    if (color === "#538DD5" || color === "#FF0000") {
                        result.style.color = "white"; 
                    } else {
                        result.style.color = "black";
                    }
                    result.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
                }

            } else {
                displayError(translations[document.getElementById("language").value].fetchError);
                console.error("Dados de temperatura/umidade/nome da cidade/timestamp não encontrados na resposta da API:", data);
                getLocationWeatherButton.classList.remove('active');
            }
        } else {
            let errorMessageText = translations[document.getElementById("language").value].fetchError;
            if (data.message) { // OpenWeatherMap usa 'message' para erros
                errorMessageText += ` (${data.message})`;
            } else if (data.cod) {
                 errorMessageText += ` (Código: ${data.cod})`;
            }
            displayError(errorMessageText);
            console.error("Erro na resposta da API OpenWeatherMap:", data);
            getLocationWeatherButton.classList.remove('active');
        }
    } catch (error) {
        displayError(translations[document.getElementById("language").value].fetchError);
        console.error("Erro ao conectar com a API OpenWeatherMap:", error);
        getLocationWeatherButton.classList.remove('active');
    }
}

function interpolate(x, x0, y0, x1, y1) {
    if (x1 === x0) return y0;
    return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

function getWbgtValueInterpolated(temp, hum) {
    const temps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
    const hums = Object.keys(wbgtData[temps[0]]).map(Number).sort((a, b) => a - b);

    temp = Math.max(temps[0], Math.min(temp, temps[temps.length - 1]));
    hum = Math.max(hums[0], Math.min(hum, hums[hums.length - 1]));


    let t0_val = temps[0];
    let t1_val = temps[temps.length - 1];
    for (let i = 0; i < temps.length; i++) {
        if (temps[i] <= temp) t0_val = temps[i];
        if (temps[i] >= temp) { t1_val = temps[i]; break; }
    }
    if (temp === temps[temps.length - 1]) {
        t0_val = temps[temps.length - 1];
        t1_val = temps[temps.length - 1];
    } else if (temp === temps[0]) {
        t0_val = temps[0];
        t1_val = temps[0];
    } else if (t0_val === t1_val && temps.indexOf(t0_val) < temps.length - 1) {
        t1_val = temps[temps.indexOf(t0_val) + 1];
    }
    

    let h0_val = hums[0];
    let h1_val = hums[hums.length - 1];
    for (let i = 0; i < hums.length; i++) {
        if (hums[i] <= hum) h0_val = hums[i];
        if (hums[i] >= hum) { h1_val = hums[i]; break; }
    }
    if (hum === hums[hums.length - 1]) {
        h0_val = hums[hums.length - 1];
        h1_val = hums[hums.length - 1];
    } else if (hum === hums[0]) {
        h0_val = hums[0];
        h1_val = hums[0];
    } else if (h0_val === h1_val && hums.indexOf(h0_val) < hums.length - 1) {
        h1_val = hums[hums.indexOf(h0_val) + 1];
    }


    const wbgt_t0_h0 = parseFloat(wbgtData[String(t0_val)]?.[String(h0_val)] || 0);
    const wbgt_t0_h1 = parseFloat(wbgtData[String(t0_val)]?.[String(h1_val)] || 0);
    const wbgt_t1_h0 = parseFloat(wbgtData[String(t1_val)]?.[String(h0_val)] || 0);
    const wbgt_t1_h1 = parseFloat(wbgtData[String(t1_val)]?.[String(h1_val)] || 0);

    let wbgt_interp;

    if (t0_val === t1_val && h0_val === h1_val) {
        wbgt_interp = wbgt_t0_h0;
    } else if (t0_val === t1_val) {
        wbgt_interp = interpolate(hum, h0_val, wbgt_t0_h0, h1_val, wbgt_t0_h1);
    } else if (h0_val === h1_val) {
        wbgt_interp = interpolate(temp, t0_val, wbgt_t0_h0, t1_val, wbgt_t1_h0);
    } else {
        const interpolated_at_h0 = interpolate(temp, t0_val, wbgt_t0_h0, t1_val, wbgt_t1_h0);
        const interpolated_at_h1 = interpolate(temp, t0_val, wbgt_t0_h1, t1_val, wbgt_t1_h1);
        wbgt_interp = interpolate(hum, h0_val, interpolated_at_h0, h1_val, interpolated_at_h1);
    }
    
    console.log(`DEBUG: Temp=${temp}, Hum=${hum} -> Pontos: T0=${t0_val}, T1=${t1_val}, H0=${h0_val}, H1=${h1_val}`);
    console.log(`DEBUG: WBGTs nos pontos: [${wbgt_t0_h0}, ${wbgt_t0_h1}, ${wbgt_t1_h0}, ${wbgt_t1_h1}]`);
    console.log(`DEBUG: Interpolação resultado bruto: ${wbgt_interp}`);

    return Math.round(wbgt_interp);
}


function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    if (temp < 21 || temp > 40) {
        displayError
