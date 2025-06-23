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

// ** CHAVE DE API DA WEATHERAPI.COM AQUI **
const WEATHERAPI_API_KEY = "b16f2d75e23e482a9775429252306"; // Sua chave da WeatherAPI.com
const WEATHERAPI_API_URL = "https://api.weatherapi.com/v1/current.json";


const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector('.container');
const manualLabel = document.getElementById('manual-label');
const locationDisplay = document.getElementById('location-display');
const lastUpdatedDisplay = document.getElementById('last-updated-display'); // Elemento para a última atualização
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
    // Protegendo contra 'null' antes de tentar usar textContent
    if (locationDisplay) locationDisplay.textContent = "";
    if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = "";
    getLocationWeatherButton.classList.remove('active');
    errorMessageBox.classList.remove("hidden");
    errorMessage.innerHTML = message;
}

function hideError() {
    errorMessageBox.classList.add("hidden");
    errorMessage.innerHTML = "";
    // Protegendo contra 'null' antes de tentar usar textContent
    if (locationDisplay) locationDisplay.textContent = "";
    if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = "";
    getLocationWeatherButton.classList.remove('active');
}

async function getGeolocationAndFetchWeather() {
    hideError(); // Limpa erros e resultados anteriores
    resultBox.classList.add("hidden");

    if (!WEATHERAPI_API_KEY) { // Usando a nova chave aqui
        displayError("Por favor, configure sua chave de API da WeatherAPI.com no script.js.");
        console.error("API Key não configurada ou inválida.");
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
    const url = `${WEATHERAPI_API_URL}?key=${WEATHERAPI_API_KEY}&q=${lat},${lon}&aqi=no`;

    console.log("Fetching weather from URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
            if (data.current && data.current.temp_c !== undefined && data.current.humidity !== undefined && data.location && data.location.name && data.location.country) {
                const temp = data.current.temp_c;
                const humidity = data.current.humidity;
                const cityName = data.location.name;
                const countryName = data.location.country;
                const lastUpdated = data.current.last_updated_epoch;
                
                const date = new Date(lastUpdated * 1000);
                const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
                const formattedTime = date.toLocaleTimeString(document.getElementById("language").value, options);
                
                const lang = document.getElementById("language").value;
                if (locationDisplay) locationDisplay.textContent = `${translations[lang].locationDisplayPrefix} ${cityName}, ${countryName}`;
                if (lastUpdatedDisplay) lastUpdatedDisplay.textContent = `${translations[lang].lastUpdatedPrefix} ${formattedTime}`;

                console.log(`DEBUG: Localizacao definida na UI: ${cityName}, ${countryName}`);
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
                console.error("Dados de temperatura/umidade/localização não encontrados na resposta da API:", data);
                getLocationWeatherButton.classList.remove('active');
            }
        } else {
            let errorMessageText = translations[document.getElementById("language").value].fetchError;
            if (data.error && data.error.message) {
                errorMessageText += ` (${data.error.message})`;
            }
            displayError(errorMessageText);
            console.error("Erro na resposta da API WeatherAPI.com:", data);
            getLocationWeatherButton.classList.remove('active');
        }
    } catch (error) {
        displayError(translations[document.getElementById("language").value].fetchError);
        console.error("Erro ao conectar com a API WeatherAPI.com:", error);
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
        displayError(translations[document.getElementById("language").value].tempOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }
    if (hum < 20 || hum > 100) {
        displayError(translations[document.getElementById("language").value].humOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    const wbgtValue = getWbgtValueInterpolated(temp, hum);

    if (wbgtValue === null || isNaN(wbgtValue)) {
        displayError(translations[document.getElementById("language").value].fetchError);
        console.error("Erro no cálculo do WBGT ou valor é nulo/NaN:", wbgtValue);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    let levelIdx;
    let color;

    if (wbgtValue >= 31) {
        levelIdx = 4;
        color = "#FF0000";
    }
    else if (wbgtValue >= 28) {
        levelIdx = 3;
        color = "#FFC000";
    }
    else if (wbgtValue >= 25) {
        levelIdx = 2;
        color = "#FFFF00";
    }
    else if (wbgtValue >= 21) {
        levelIdx = 1;
        color = "#C5D9F1";
    }
    else {
        levelIdx = 0;
        color = "#538DD5";
    }

    return { wbgt: wbgtValue, levelIdx: levelIdx, color: color };
}

function updateLanguage(lang) {
    const t = translations[lang];
    // Ajusta o texto do título em duas partes
    mainTitleElement.textContent = t.titleMain;
    subTitleElement.textContent = t.titleSub;

    document.getElementById("label-temp").textContent = t.temperature;
    document.getElementById("label-humidity").textContent = t.humidity;
    document.getElementById("calculate").textContent = t.calculate;
    document.getElementById("clear").textContent = t.clear;
    document.getElementById("dark-label").textContent = t.dark;
    document.getElementById("get-location-weather").textContent = t.getLocationWeather;
    if (manualLabel) manualLabel.textContent = t.manualLabel;

    hideError();
}

document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("get-location-weather").addEventListener("click", getGeolocationAndFetchWeather);


document.getElementById("calculate").addEventListener("click", () => {
    hideError();
    locationDisplay.textContent = ""; // Limpa a localização exibida se o cálculo for manual
    lastUpdatedDisplay.textContent = ""; // Limpa a atualização se o cálculo for manual
    getLocationWeatherButton.classList.remove('active'); // Remove o 'active' do botão de localização ao calcular manualmente


    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = document.getElementById("language").value;

    if (isNaN(temp) || isNaN(hum)) {
        displayError(translations[lang].invalidInput);
        return;
    }

    const { wbgt, levelIdx, color } = calculateWBGT(temp, hum);

    if (wbgt === null || isNaN(wbgt)) {
        resultBox.classList.add("hidden");
        return;
    }

    const label = translations[lang].levels[levelIdx];

    resultBox.classList.remove("hidden");
    resultBox.style.backgroundColor = color;
    if (color === "#538DD5" || color === "#FF0000") {
        result.style.color = "white"; 
    } else {
        result.style.color = "black";
    }
    result.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    resultBox.classList.add("hidden");
    hideError();
    locationDisplay.textContent = "";
    lastUpdatedDisplay.textContent = ""; // Limpa a última atualização
    getLocationWeatherButton.classList.remove('active');
});

let originalScrollTop = 0;
let isKeyboardShowing = false;

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('focus', () => {
        originalScrollTop = window.scrollY || document.documentElement.scrollTop;
        isKeyboardShowing = true;
        setTimeout(() => {
            if (isKeyboardShowing) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    });

    input.addEventListener('blur', () => {
        isKeyboardShowing = false;
    });
});

window.addEventListener('resize', () => {
    if (isKeyboardShowing) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(document.getElementById("language").value);
});
