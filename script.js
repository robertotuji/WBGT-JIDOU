const translations = {
    ja: {
        title: "WBGTチェッカー（手動）", // Título de volta para Manual
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
        tempOutOfRange: "WBGTテーブルに値が記録されていないため、温度は21°Cから40°Cの間である必要があります。",
        humOutOfRange: "WBGTテーブルに値が記録されていないため、相対湿度は20%から100%の間である必要があります。", // Texto da umidade corrigido, removendo "5 em 5"
        // REMOVIDO: getLocationWeather, locationPermissionDenied, etc.
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
        title: "Verificador WBGT (Manual)", // Título de volta para Manual
        temperature: "Temperatura (°C) Temperatura de Bulbo Seco:",
        humidity: "Umidade (%):",
        calculate: "Calcular",
        clear: "Limpar",
        dark: "Modo Escuro",
        invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
        tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C, pois fora desses limites não há valores registrados na tabela WBGT.",
        humOutOfRange: "A umidade relativa deve estar entre 20% e 100%, pois fora desses limites não há valores registrados na tabela WBGT.", // Texto da umidade corrigido, removendo "5 em 5"
        // REMOVIDO: getLocationWeather, locationPermissionDenied, etc.
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
        title: "WBGT Checker (Manual)", // Título de volta para Manual
        temperature: "Temperature (°C)Dry Bulb Temperature:",
        humidity: "Humidity (%):",
        calculate: "Calculate",
        clear: "Clear",
        dark: "Dark Mode",
        invalidInput: "Please enter valid Temperature and Humidity values.",
        tempOutOfRange: "Temperature must be between 21°C and 40°C, as there are no recorded values outside these limits in the WBGT table.",
        humOutOfRange: "Relative humidity must be between 20% and 100%, as there are no recorded values outside these limits in the WBGT table.", // Texto da umidade corrigido, removendo "5 em 5"
        // REMOVIDO: getLocationWeather, locationPermissionDenied, etc.
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
        title: "Pemeriksa WBGT (Manual)", // Título de volta para Manual
        temperature: "Suhu (°C) Suhu Bola Kering:",
        humidity: "Kelembaban (%):",
        calculate: "Hitung",
        clear: "Bersihkan",
        dark: "Mode Gelap",
        invalidInput: "Mohon masukkan nilai Suhu dan Kelembaban yang valid.",
        tempOutOfRange: "Suhu harus antara 21°C dan 40°C, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        humOutOfRange: "Kelembaban relatif harus antara 20% dan 100%, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.", // Texto da umidade corrigido, removendo "5 em 5"
        // REMOVIDO: getLocationWeather, locationPermissionDenied, etc.
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

// REMOVIDO: OPENWEATHER_API_KEY e OPENWEATHER_API_URL
// REMOVIDO: container (não mais necessário para lógica complexa de rolagem)
const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box");
const errorMessage = document.getElementById("error-message");
const manualLabel = document.getElementById('manual-label'); // Mantém para a label "Ou insira manualmente"
// REMOVIDO: locationDisplay e getLocationWeatherButton (não serão mais usados nesta versão)


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
    // REMOVIDO: locationDisplay.textContent = "";
    // REMOVIDO: getLocationWeatherButton.classList.remove('active');
    errorMessageBox.classList.remove("hidden");
    errorMessage.innerHTML = message;
}

function hideError() {
    errorMessageBox.classList.add("hidden");
    errorMessage.innerHTML = "";
    // REMOVIDO: locationDisplay.textContent = "";
    // REMOVIDO: getLocationWeatherButton.classList.remove('active');
}

// REMOVIDO: getGeolocationAndFetchWeather()
// REMOVIDO: fetchWeatherDataByCoords()
// REMOVIDO: interpolate() (agora a interpolação será mais simples ou desnecessária para esta versão)

// NOVA FUNÇÃO calculateWBGT (VERSÃO SIMPLIFICADA E QUE JÁ FUNCIONAVA)
function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    // Validação de limites (sem a regra de "5 em 5" para a umidade, apenas min/max)
    if (temp < 21 || temp > 40) {
        displayError(translations[document.getElementById("language").value].tempOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }
    if (hum < 20 || hum > 100) {
        displayError(translations[document.getElementById("language").value].humOutOfRange);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    // Lógica SIMPLIFICADA para buscar o WBGT da tabela (sem interpolação complexa)
    // Isso requer que os valores de temp e hum sejam arredondados para inteiros múltiplos de 5
    // conforme as chaves da sua tabela.
    const roundedTemp = Math.round(temp);
    const roundedHum = Math.round(hum);

    // Ajuste para garantir que umidade seja múltipla de 5 (como a tabela original)
    const adjustedHum = Math.round(roundedHum / 5) * 5;
    
    // Assegura que os valores estejam dentro dos limites da tabela
    const finalTemp = Math.max(21, Math.min(40, roundedTemp));
    const finalHum = Math.max(20, Math.min(100, adjustedHum));


    const wbgtValue = parseFloat(wbgtData[String(finalTemp)]?.[String(finalHum)]);

    if (wbgtValue === undefined || isNaN(wbgtValue)) {
        displayError(translations[document.getElementById("language").value].fetchError + ". Verifique se os valores de Temperatura e Umidade inseridos manualmente correspondem exatamente à tabela.");
        console.error("Erro no cálculo do WBGT ou valor não encontrado na tabela para:", finalTemp, finalHum);
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
    // REMOVIDO: document.getElementById("get-location-weather").textContent = t.getLocationWeather;
    if (manualLabel) manualLabel.textContent = t.manualLabel;

    hideError();
}

document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// REMOVIDO: document.getElementById("get-location-weather").addEventListener("click", getGeolocationAndFetchWeather);


document.getElementById("calculate").addEventListener("click", () => {
    hideError();
    // REMOVIDO: locationDisplay.textContent = "";
    // REMOVIDO: getLocationWeatherButton.classList.remove('active');

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
    // REMOVIDO: locationDisplay.textContent = "";
    // REMOVIDO: getLocationWeatherButton.classList.remove('active');
});

// REMOVIDO: Lógica para teclado virtual (para simplificar a depuração de outras coisas)
// let originalScrollTop = 0;
// let isKeyboardShowing = false;
// document.querySelectorAll('input[type="number"]').forEach(input => {
//     input.addEventListener('focus', () => {
//         originalScrollTop = window.scrollY || document.documentElement.scrollTop;
//         isKeyboardShowing = true;
//         setTimeout(() => {
//             if (isKeyboardShowing) {
//                 input.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//         }, 100);
//     });
//     input.addEventListener('blur', () => {
//         isKeyboardShowing = false;
//     });
// });
// window.addEventListener('resize', () => {
//     if (isKeyboardShowing) {
//         const activeElement = document.activeElement;
//         if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
//             activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(document.getElementById("language").value);
});
