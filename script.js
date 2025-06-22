const translations = {
    ja: {
        title: "WBGTチェッカー（ロケーション）", // Título atualizado
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
        tempOutOfRange: "WBGTテーブルに値が記録されていないため、温度は21°Cから40°Cの間である必要があります。",
        humOutOfRange: "WBGTテーブルに値が記録されていないため、相対湿度は20%から100%の間で、5刻みである必要があります。",
        getLocationWeather: "現在の位置の天気を取得", // Nova tradução para o botão
        locationPermissionDenied: "位置情報へのアクセスが拒否されました。設定で許可してください。", // Nova tradução
        locationNotAvailable: "位置情報が利用できません。", // Nova tradução
        locationTimeout: "位置情報の取得がタイムアウトしました。もう一度お試しください。", // Nova tradução
        fetchError: "気象データの取得中にエラーが発生しました。後でもう一度お試しください。", // Nova tradução
        levels: [
            "ほぼ安全",
            "注意",
            "警戒",
            "厳重警戒",
            "危険"
        ]
    },
    pt: {
        title: "Verificador WBGT (Localização)", // Título atualizado
        temperature: "Temperatura (°C) Temperatura de Bulbo Seco:",
        humidity: "Umidade (%):",
        calculate: "Calcular",
        clear: "Limpar",
        dark: "Modo Escuro",
        invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
        tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C, pois fora desses limites não há valores registrados na tabela WBGT.",
        humOutOfRange: "A umidade relativa deve estar entre 20% e 100%, com intervalos de 5 em 5, pois fora desses limites não há valores registrados na tabela WBGT.",
        getLocationWeather: "Obter Clima da Localização Atual", // Nova tradução para o botão
        locationPermissionDenied: "Permissão de localização negada. Por favor, habilite nas configurações do seu dispositivo.", // Nova tradução
        locationNotAvailable: "Localização não disponível.", // Nova tradução
        locationTimeout: "Tempo esgotado para obter a localização. Por favor, tente novamente.", // Nova tradução
        fetchError: "Erro ao buscar dados do clima. Por favor, tente novamente mais tarde.", // Nova tradução
        levels: [
            "Quase Seguro",
            "Atenção",
            "Alerta",
            "Alerta Máximo",
            "Perigo"
        ]
    },
    en: {
        title: "WBGT Checker (Location)", // Título atualizado
        temperature: "Temperature (°C)Dry Bulb Temperature:",
        humidity: "Humidity (%):",
        calculate: "Calculate",
        clear: "Clear",
        dark: "Dark Mode",
        invalidInput: "Please enter valid Temperature and Humidity values.",
        tempOutOfRange: "Temperature must be between 21°C and 40°C, as there are no recorded values outside these limits in the WBGT table.",
        humOutOfRange: "Relative humidity must be between 20% and 100%, with intervals of 5, as there are no recorded values outside these limits in the WBGT table.",
        getLocationWeather: "Get Current Location Weather", // Nova tradução para o botão
        locationPermissionDenied: "Location permission denied. Please enable in your device settings.", // Nova tradução
        locationNotAvailable: "Location information not available.", // Nova tradução
        locationTimeout: "The request to get user location timed out. Please try again.", // Nova tradução
        fetchError: "Error fetching weather data. Please try again later.", // Nova tradução
        levels: [
            "Almost Safe",
            "Caution",
            "Warning",
            "High Alert",
            "Danger"
        ]
    },
    id: {
        title: "Pemeriksa WBGT (Lokasi)", // Título atualizado
        temperature: "Suhu (°C) Suhu Bola Kering:",
        humidity: "Kelembaban (%):",
        calculate: "Hitung",
        clear: "Bersihkan",
        dark: "Mode Gelap",
        invalidInput: "Mohon masukkan nilai Suhu dan Kelembaban yang valid.",
        tempOutOfRange: "Suhu harus antara 21°C dan 40°C, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        humOutOfRange: "Kelembaban relatif harus antara 20% dan 100%, dengan interval 5, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        getLocationWeather: "Dapatkan Cuaca Lokasi Saat Ini", // Nova tradução
        locationPermissionDenied: "Izin lokasi ditolak. Harap aktifkan di pengaturan perangkat Anda.", // Nova tradução
        locationNotAvailable: "Informasi lokasi tidak tersedia.", // Nova tradução
        locationTimeout: "Permintaan untuk mendapatkan lokasi pengguna telah habis waktu. Silakan coba lagi.", // Nova tradução
        fetchError: "Terjadi kesalahan saat mengambil data cuaca. Silakan coba lagi nanti.", // Nova tradução
        levels: [
            "Hampir Aman",
            "Waspada",
            "Siaga",
            "Siaga Tinggi",
            "Bahaya"
        ]
    }
};

// ** SUA CHAVE DE API DO OPENWEATHERMAP AQUI **
// CUIDADO: Esta chave ficará visível no código do navegador.
// Para um projeto real ou de alto uso, o ideal é usar um backend para escondê-la.
const OPENWEATHER_API_KEY = "SUA_CHAVE_DE_API_OPENWEATHERMAP_AQUI"; // <-- COLOQUE SUA CHAVE AQUI
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";


const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector('.container');

let wbgtData = {};

async function loadWbgtData() {
    try {
        // Caminho ajustado para o novo subdiretório do GitHub Pages
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

// NOVA FUNÇÃO: Obtém a localização do usuário e depois busca o clima
async function getGeolocationAndFetchWeather() {
    hideError(); // Limpa erros anteriores
    resultBox.classList.add("hidden"); // Esconde resultados anteriores

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
                // Agora que temos as coordenadas, buscamos o clima
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

// NOVA FUNÇÃO: Busca dados do clima pela latitude e longitude
async function fetchWeatherDataByCoords(lat, lon) {
    const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`; // units=metric para Celsius

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            if (data.main && data.main.temp !== undefined && data.main.humidity !== undefined) {
                const temp = data.main.temp;
                const humidity = data.main.humidity;

                // Preenche os campos de input com os valores da API
                document.getElementById("temperature").value = temp.toFixed(1); // Arredonda para 1 casa decimal
                document.getElementById("humidity").value = humidity;

                // Força o cálculo do WBGT com os novos valores
                document.getElementById("calculate").click(); // Simula o clique no botão calcular

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


function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    if (temp < 21 || temp > 40) {
        displayError(translations[document.getElementById("language").value].tempOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }
    if (hum < 20 || hum > 100 || hum % 5 !== 0) {
        displayError(translations[document.getElementById("language").value].humOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    const roundedTemp = Math.round(temp);
    const roundedHum = Math.round(hum);

    const tempKey = String(roundedTemp);
    const humKey = String(roundedHum);

    let wbgtValue = null;

    if (wbgtData[tempKey] && wbgtData[tempKey][humKey]) {
        wbgtValue = wbgtData[tempKey][humKey];
    } else {
        const availableTemps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
        let closestTemp = availableTemps.reduce((prev, curr) => (
            Math.abs(curr - temp) < Math.abs(prev - temp) ? curr : prev
        ));
        closestTemp = Math.min(Math.max(closestTemp, 21), 40);

        if (wbgtData[String(closestTemp)]) {
            const availableHums = Object.keys(wbgtData[String(closestTemp)]).map(Number).sort((a, b) => a - b);
            let closestHum = availableHums.reduce((prev, curr) => (
                Math.abs(curr - hum) < Math.abs(prev - hum) ? curr : prev
            ));
            closestHum = Math.min(Math.max(closestHum, 20), 100);

            closestHum = Math.round(closestHum / 5) * 5;
            closestHum = Math.min(Math.max(closestHum, 20), 100);

            if (wbgtData[String(closestTemp)][String(closestHum)]) {
                 wbgtValue = wbgtData[String(closestTemp)][String(closestHum)];
                 console.warn(`WBGT: Usando valores aproximados - Temp: ${closestTemp}°C, Hum: ${closestHum}% para Temp: ${temp}°C, Hum: ${hum}%`);
            } else {
                 console.error(`Não foi possível encontrar WBGT para temp ${temp} e hum ${hum} mesmo com aproximação.`);
                 displayError(translations[document.getElementById("language").value].invalidInput);
                 return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
            }
        }
    }

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
    // NOVO: Atualiza o texto do botão de geolocalização
    document.getElementById("get-location-weather").textContent = t.getLocationWeather;
    // Remove os elementos de cidade que não existem mais (garante que não haja erro se o JS for executado em HTML antigo)
    // if (document.getElementById("label-city")) document.getElementById("label-city").textContent = t.cityName;
    // if (document.getElementById("fetch-weather")) document.getElementById("fetch-weather").textContent = t.fetchWeather;
    if (document.getElementById("manual-label")) document.getElementById("manual-label").textContent = t["Ou insira manualmente:"] || "Ou insira manualmente:"; // Garante tradução de label manual

    hideError();
}

document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// NOVO: Event listener para o botão "Obter Clima da Localização Atual"
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
    // if (document.getElementById("city-name")) document.getElementById("city-name").value = ""; // Remove o campo da cidade
    resultBox.classList.add("hidden");
    hideError();
});

// Lógica para tentar corrigir o desalinhamento ao exibir o teclado virtual (mantida)
let originalScrollTop = 0;
let isKeyboardShowing = false;

// Observa o evento de foco nos inputs (agora incluindo type="number" apenas, pois text foi removido)
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
