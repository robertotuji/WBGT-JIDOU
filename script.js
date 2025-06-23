const translations = {
    ja: {
        title: "WBGT",
        title_sub: "チェッカー",
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
        levels: [ "ほぼ安全", "注意", "警戒", "厳重警戒", "危険" ]
    },
    pt: {
        title: "WBGT",
        title_sub: "Verificação",
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
        levels: [ "Quase Seguro", "Atenção", "Alerta", "Alerta Máximo", "Perigo" ]
    },
    en: {
        title: "WBGT",
        title_sub: "Checker",
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
        levels: [ "Almost Safe", "Caution", "Warning", "High Alert", "Danger" ]
    },
    id: {
        title: "WBGT",
        title_sub: "Pemeriksa",
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
        levels: [ "Hampir Aman", "Waspada", "Siaga", "Siaga Tinggi", "Bahaya" ]
    }
};

const OPENWEATHER_API_KEY = "ef9a9484e8ec68d89092a92a5281841e";
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector('.container');
const manualLabel = document.getElementById('manual-label');
const locationDisplay = document.getElementById('location-display');
const getLocationWeatherButton = document.getElementById('get-location-weather');

let wbgtData = {};

async function loadWbgtData() {
    try {
        const response = await fetch('/WBGT-JIDOU/wbgt_table_preciso.json');
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        wbgtData = await response.json();
        console.log("Dados WBGT carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar os dados WBGT:", error);
        alert("Erro ao carregar a tabela de WBGT. Por favor, tente novamente mais tarde.");
    }
}

function displayError(message) {
    resultBox.classList.add("hidden");
    locationDisplay.textContent = "";
    if (getLocationWeatherButton) getLocationWeatherButton.classList.remove('active');
    errorMessageBox.classList.remove("hidden");
    errorMessage.innerHTML = message;
}

function hideError() {
    errorMessageBox.classList.add("hidden");
    errorMessage.innerHTML = "";
}

async function getGeolocationAndFetchWeather() {
    hideError();
    resultBox.classList.add("hidden");

    if (!OPENWEATHER_API_KEY) {
        displayError("Por favor, configure sua chave de API do OpenWeatherMap no script.js.");
        return;
    }

    getLocationWeatherButton.classList.add('active');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await fetchWeatherDataByCoords(lat, lon);
            },
            (error) => {
                const lang = document.getElementById("language").value;
                let msg = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED: msg = translations[lang].locationPermissionDenied; break;
                    case error.POSITION_UNAVAILABLE: msg = translations[lang].locationNotAvailable; break;
                    case error.TIMEOUT: msg = translations[lang].locationTimeout; break;
                    default: msg = translations[lang].fetchError; break;
                }
                displayError(msg);
                console.error("Erro de geolocalização:", error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        displayError("Seu navegador não suporta geolocalização.");
    }
}

async function fetchWeatherDataByCoords(lat, lon) {
    const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.main) {
            const { temp, humidity } = data.main;
            const { name, sys } = data;
            const lang = document.getElementById("language").value;
            locationDisplay.textContent = `${translations[lang].locationDisplayPrefix} ${name}, ${sys.country}`;
            document.getElementById("temperature").value = temp.toFixed(1);
            document.getElementById("humidity").value = humidity;
            document.getElementById("calculate").click();
        } else {
            throw new Error(data.message || "Dados incompletos da API");
        }
    } catch (error) {
        const lang = document.getElementById("language").value;
        displayError(translations[lang].fetchError);
        console.error("Erro na API OpenWeatherMap:", error);
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

    let t0_val = temps.find(t => t >= temp) || temps[temps.length - 1];
    let t1_val = temps[temps.indexOf(t0_val) - 1] || t0_val;
    [t0_val, t1_val] = [t1_val, t0_val];

    let h0_val = hums.find(h => h >= hum) || hums[hums.length - 1];
    let h1_val = hums[hums.indexOf(h0_val) - 1] || h0_val;
    [h0_val, h1_val] = [h1_val, h0_val];
    
    const wbgt_t0_h0 = wbgtData[String(t0_val)][String(h0_val)];
    const wbgt_t0_h1 = wbgtData[String(t0_val)][String(h1_val)];
    const wbgt_t1_h0 = wbgtData[String(t1_val)][String(h0_val)];
    const wbgt_t1_h1 = wbgtData[String(t1_val)][String(h1_val)];

    if (t0_val === t1_val) return interpolate(hum, h0_val, wbgt_t0_h0, h1_val, wbgt_t0_h1);
    if (h0_val === h1_val) return interpolate(temp, t0_val, wbgt_t0_h0, t1_val, wbgt_t1_h0);

    const interp_h0 = interpolate(temp, t0_val, wbgt_t0_h0, t1_val, wbgt_t1_h0);
    const interp_h1 = interpolate(temp, t0_val, wbgt_t0_h1, t1_val, wbgt_t1_h1);
    return interpolate(hum, h0_val, interp_h0, h1_val, interp_h1);
}

function calculateWBGT(temp, hum) {
    const lang = document.getElementById("language").value;
    if (Object.keys(wbgtData).length === 0) return { error: translations[lang].invalidInput };
    if (temp < 21 || temp > 40) return { error: translations[lang].tempOutOfRange };
    if (hum < 20 || hum > 100) return { error: translations[lang].humOutOfRange };

    const wbgtValue = Math.round(getWbgtValueInterpolated(temp, hum));
    if (isNaN(wbgtValue)) return { error: translations[lang].fetchError };
    
    let levelIdx, color;
    if (wbgtValue >= 31) { levelIdx = 4; color = "#FF0000"; }
    else if (wbgtValue >= 28) { levelIdx = 3; color = "#FFC000"; }
    else if (wbgtValue >= 25) { levelIdx = 2; color = "#FFFF00"; }
    else if (wbgtValue >= 21) { levelIdx = 1; color = "#C5D9F1"; }
    else { levelIdx = 0; color = "#538DD5"; }

    return { wbgt: wbgtValue, levelIdx, color, label: translations[lang].levels[levelIdx] };
}

function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById("title-main").textContent = t.title;
    document.getElementById("title-sub").textContent = t.title_sub;
    document.getElementById("label-temp").textContent = t.temperature;
    document.getElementById("label-humidity").textContent = t.humidity;
    document.getElementById("calculate").textContent = t.calculate;
    document.getElementById("clear").textContent = t.clear;
    document.getElementById("dark-label").textContent = t.dark;
    document.getElementById("get-location-weather").textContent = t.getLocationWeather;
    if (manualLabel) manualLabel.textContent = t.manualLabel;
    hideError();
}

document.getElementById("calculate").addEventListener("click", () => {
    if (document.activeElement.id === "get-location-weather") {
        // Não limpa a localização se o cálculo foi disparado pela busca de clima
    } else {
        locationDisplay.textContent = "";
        getLocationWeatherButton.classList.remove('active');
    }
    hideError();
    
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    
    if (isNaN(temp) || isNaN(hum)) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return;
    }

    const resultData = calculateWBGT(temp, hum);

    if (resultData.error) {
        displayError(resultData.error);
        resultBox.classList.add("hidden");
        return;
    }

    resultBox.classList.remove("hidden");
    resultBox.style.backgroundColor = resultData.color;
    
    resultBox.classList.remove("text-light", "text-dark");
    if (resultData.color === "#538DD5" || resultData.color === "#FF0000") {
        resultBox.classList.add("text-light");
    } else {
        resultBox.classList.add("text-dark");
    }
    
    result.innerHTML = `WBGT: ${resultData.wbgt}°C<br><strong>${resultData.label}</strong>`;
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    resultBox.classList.add("hidden");
    hideError();
    locationDisplay.textContent = "";
    getLocationWeatherButton.classList.remove('active');
});

// --- O restante do código permanece o mesmo ---
document.addEventListener("DOMContentLoaded", () => {
    loadWbgtData();
    updateLanguage(document.getElementById("language").value);

    document.getElementById("language").addEventListener("change", (e) => updateLanguage(e.target.value));
    document.getElementById("dark-mode").addEventListener("change", () => document.body.classList.toggle("dark-mode"));
    document.getElementById("get-location-weather").addEventListener("click", getGeolocationAndFetchWeather);
});
