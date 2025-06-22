const translations = {
    ja: {
        title: "WBGTチェッカー（ロケーション）",
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
        tempOutOfRange: "WBGTテーブルに値が記録されていないため、温度は21°Cから40°Cの間である必要があります。",
        humOutOfRange: "WBGTテーブルに値が記録されていないため、相対湿度は20%から100%の間である必要があります。", // Texto da umidade corrigido, removendo "5 em 5"
        getLocationWeather: "現在の位置の天気を取得",
        locationPermissionDenied: "位置情報へのアクセスが拒否されました。設定で許可してください。",
        locationNotAvailable: "位置情報が利用できません。",
        locationTimeout: "位置情報の取得がタイムアウトしました。もう一度お試しください。",
        fetchError: "気象データの取得中にエラーが発生しました。後でもう一度お試しください。",
        manualLabel: "または手動で入力:", // Nova tradução para "Ou insira manualmente"
        levels: [
            "ほぼ安全",
            "注意",
            "警戒",
            "厳重警戒",
            "危険"
        ]
    },
    pt: {
        title: "Verificador WBGT (Localização)",
        temperature: "Temperatura (°C) Temperatura de Bulbo Seco:",
        humidity: "Umidade (%):",
        calculate: "Calcular",
        clear: "Limpar",
        dark: "Modo Escuro",
        invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
        tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C, pois fora desses limites não há valores registrados na tabela WBGT.",
        humOutOfRange: "A umidade relativa deve estar entre 20% e 100%, pois fora desses limites não há valores registrados na tabela WBGT.", // Texto da umidade corrigido, removendo "5 em 5"
        getLocationWeather: "Obter Clima da Localização Atual",
        locationPermissionDenied: "Permissão de localização negada. Por favor, habilite nas configurações do seu dispositivo.",
        locationNotAvailable: "Localização não disponível.",
        locationTimeout: "Tempo esgotado para obter a localização. Por favor, tente novamente.",
        fetchError: "Erro ao buscar dados do clima. Por favor, tente novamente mais tarde.",
        manualLabel: "Ou insira manualmente:", // Nova tradução para "Ou insira manualmente"
        levels: [
            "Quase Seguro",
            "Atenção",
            "Alerta",
            "Alerta Máximo",
            "Perigo"
        ]
    },
    en: {
        title: "WBGT Checker (Location)",
        temperature: "Temperature (°C)Dry Bulb Temperature:",
        humidity: "Humidity (%):",
        calculate: "Calculate",
        clear: "Clear",
        dark: "Dark Mode",
        invalidInput: "Please enter valid Temperature and Humidity values.",
        tempOutOfRange: "Temperature must be between 21°C and 40°C, as there are no recorded values outside these limits in the WBGT table.",
        humOutOfRange: "Relative humidity must be between 20% and 100%, as there are no recorded values outside these limits in the WBGT table.", // Texto da umidade corrigido, removendo "5 em 5"
        getLocationWeather: "Get Current Location Weather",
        locationPermissionDenied: "Location permission denied. Please enable in your device settings.",
        locationNotAvailable: "Location information not available.",
        locationTimeout: "The request to get user location timed out. Please try again.",
        fetchError: "Error fetching weather data. Please try again later.",
        manualLabel: "Or enter manually:", // Nova tradução para "Ou insira manualmente"
        levels: [
            "Almost Safe",
            "Caution",
            "Warning",
            "High Alert",
            "Danger"
        ]
    },
    id: {
        title: "Pemeriksa WBGT (Lokasi)",
        temperature: "Suhu (°C) Suhu Bola Kering:",
        humidity: "Kelembaban (%):",
        calculate: "Hitung",
        clear: "Bersihkan",
        dark: "Mode Gelap",
        invalidInput: "Mohon masukkan nilai Suhu dan Kelembaban yang valid.",
        tempOutOfRange: "Suhu harus antara 21°C dan 40°C, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        humOutOfRange: "Kelembaban relatif harus antara 20% dan 100%, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.", // Texto da umidade corrigido, removendo "5 em 5"
        getLocationWeather: "Dapatkan Cuaca Lokasi Saat Ini",
        locationPermissionDenied: "Izin lokasi ditolak. Harap aktifkan di pengaturan perangkat Anda.",
        locationNotAvailable: "Informasi lokasi tidak tersedia.",
        locationTimeout: "Permintaan untuk mendapatkan lokasi pengguna telah habis waktu. Silakan coba lagi.",
        fetchError: "Terjadi kesalahan saat mengambil data cuaca. Silakan coba lagi nanti.",
        manualLabel: "Atau masukkan secara manual:", // Nova tradução para "Ou insira manualmente"
        levels: [
            "Hampir Aman",
            "Waspada",
            "Siaga",
            "Siaga Tinggi",
            "Bahaya"
        ]
    }
};

const OPENWEATHER_API_KEY = "SUA_CHAVE_DE_API_OPENWEATHERMAP_AQUI";
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";


const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector('.container');
const manualLabel = document.getElementById('manual-label'); // Pega o elemento do parágrafo "Ou insira manualmente:"

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

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "SUA_CHAVE_DE_API_OPENWEATHERMAP_AQUI") {
        displayError("Por favor, configure sua chave de API do OpenWeatherMap no script.js.");
        console.error("API Key não configurada.");
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
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
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
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

        if (response.ok) {
            if (data.main && data.main.temp !== undefined && data.main.humidity !== undefined) {
                const temp = data.main.temp;
                const humidity = data.main.humidity;

                // Preenche os campos de input com os valores da API
                document.getElementById("temperature").value = temp.toFixed(1);
                document.getElementById("humidity").value = humidity;

                document.getElementById("calculate").click();

            } else {
                displayError(translations[document.getElementById("language").value].fetchError);
                console.error("Dados de temperatura ou umidade não encontrados na resposta da API:", data);
            }
        } else {
            displayError(translations[document.getElementById("language").value].fetchError);
            console.error("Erro na resposta da API OpenWeatherMap:", data.message);
        }
    } catch (error) {
        displayError(translations[document.getElementById("language").value].fetchError);
        console.error("Erro ao conectar com a API OpenWeatherMap:", error);
    }
}

// Interpolação Linear para WBGT
function interpolate(x, x0, y0, x1, y1) {
    return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

// Função para obter o valor WBGT da tabela com interpolação
function getWbgtValueInterpolated(temp, hum) {
    const temps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
    const hums = Object.keys(wbgtData[temps[0]]).map(Number).sort((a, b) => a - b);

    // Encontra os 4 pontos mais próximos na tabela para interpolação bilinear
    let t0 = temps[0], t1 = temps[0];
    for (let i = 0; i < temps.length; i++) {
        if (temps[i] <= temp) t0 = temps[i];
        if (temps[i] >= temp) { t1 = temps[i]; break; }
    }
    if (t0 === t1 && temp > t0) t1 = temps[temps.indexOf(t0) + 1] || t0; // Handle exact match or highest value
    if (t0 === t1 && temp < t0) t0 = temps[temps.indexOf(t1) - 1] || t1; // Handle exact match or lowest value


    let h0 = hums[0], h1 = hums[0];
    for (let i = 0; i < hums.length; i++) {
        if (hums[i] <= hum) h0 = hums[i];
        if (hums[i] >= hum) { h1 = hums[i]; break; }
    }
    if (h0 === h1 && hum > h0) h1 = hums[hums.indexOf(h0) + 1] || h0; // Handle exact match or highest value
    if (h0 === h1 && hum < h0) h0 = hums[hums.indexOf(h1) - 1] || h1; // Handle exact match or lowest value


    const wbgt_t0_h0 = wbgtData[String(t0)][String(h0)];
    const wbgt_t0_h1 = wbgtData[String(t0)][String(h1)];
    const wbgt_t1_h0 = wbgtData[String(t1)][String(h0)];
    const wbgt_t1_h1 = wbgtData[String(t1)][String(h1)];

    // Se a temperatura ou umidade for exatamente um valor da tabela ou nos limites
    if (t0 === t1 && h0 === h1) return wbgt_t0_h0;
    if (t0 === t1) return interpolate(hum, h0, wbgt_t0_h0, h1, wbgt_t0_h1);
    if (h0 === h1) return interpolate(temp, t0, wbgt_t0_h0, t1, wbgt_t1_h0);

    // Interpolação bilinear
    const interpolated_t0 = interpolate(hum, h0, wbgt_t0_h0, h1, wbgt_t0_h1);
    const interpolated_t1 = interpolate(hum, h0, wbgt_t1_h0, h1, wbgt_t1_h1);

    return Math.round(interpolate(temp, t0, interpolated_t0, t1, interpolated_t1)); // Arredonda o resultado final
}


function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    // Validação de limites (sem a regra de "5 em 5" ou "inteiro" para dados em tempo real)
    if (temp < 21 || temp > 40) {
        displayError(translations[document.getElementById("language").value].tempOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }
    if (hum < 20 || hum > 100) { // Removida a validação "hum % 5 !== 0"
        displayError(translations[document.getElementById("language").value].humOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    // Usa a nova função de interpolação
    const wbgtValue = getWbgtValueInterpolated(temp, hum);

    if (wbgtValue === null) {
        displayError(translations[document.getElementById("language").value].invalidInput);
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
    document.getElementById("title").textContent = t.title;
    document.getElementById("label-temp").textContent = t.temperature;
    document.getElementById("label-humidity").textContent = t.humidity;
    document.getElementById("calculate").textContent = t.calculate;
    document.getElementById("clear").textContent = t.clear;
    document.getElementById("dark-label").textContent = t.dark;
    document.getElementById("get-location-weather").textContent = t.getLocationWeather;
    if (manualLabel) manualLabel.textContent = t.manualLabel; // Atualiza a label "Ou insira manualmente"

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
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = document.getElementById("language").value;

    if (isNaN(temp) || isNaN(hum)) {
        displayError(translations[lang].invalidInput);
        return;
    }

    const { wbgt, levelIdx, color } = calculateWBGT(temp, hum);

    if (wbgt === null) {
        resultBox.classList.add("hidden");
        return;
    }

    const label = translations[lang].levels[levelIdx];

    resultBox.classList.remove("hidden");
    resultBox.style.backgroundColor = color;
    if (color === "#538DD5" || color === "#FF0000") {
        resultBox.classList.add("dark-bg-text-white");
    } else {
        resultBox.classList.remove("dark-bg-text-white");
    }
    result.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    resultBox.classList.add("hidden");
    hideError();
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
