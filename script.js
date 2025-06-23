document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language');
    const darkModeToggle = document.getElementById('dark-mode');
    loadWbgtData();
    const savedLang = localStorage.getItem('wbgt-lang') || 'pt';
    languageSelect.value = savedLang;
    updateLanguage(savedLang);
    document.documentElement.lang = savedLang;
    const darkModeSaved = localStorage.getItem('wbgt-dark-mode') === 'true';
    darkModeToggle.checked = darkModeSaved;
    if (darkModeSaved) {
        document.body.classList.add('dark-mode');
    }
    languageSelect.addEventListener("change", (e) => {
        const newLang = e.target.value;
        localStorage.setItem('wbgt-lang', newLang);
        updateLanguage(newLang);
    });
    darkModeToggle.addEventListener("change", () => {
        const isDarkMode = darkModeToggle.checked;
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem('wbgt-dark-mode', isDarkMode);
    });
    document.getElementById('get-location-weather').addEventListener("click", getGeolocationAndFetchWeather);
    document.getElementById("calculate").addEventListener("click", handleCalculation);
    document.getElementById("clear").addEventListener("click", clearAll);
    const infoButton = document.getElementById('info-button');
    const infoPopup = document.getElementById('info-popup');
    const popupCloseButton = document.querySelector('.popup-close-btn');
    infoButton.addEventListener('click', () => {
        const currentLang = localStorage.getItem('wbgt-lang') || 'pt';
        const t = translations[currentLang];
        document.getElementById('popup-title-brief').textContent = t.popupBriefTitle;
        document.getElementById('popup-text-brief').textContent = t.popupBriefText;
        infoPopup.classList.remove('hidden');
    });
    popupCloseButton.addEventListener('click', () => {
        infoPopup.classList.add('hidden');
    });
    infoPopup.addEventListener('click', (event) => {
        if (event.target === infoPopup) {
            infoPopup.classList.add('hidden');
        }
    });
});
let wbgtData = {};
const OPENWEATHER_API_KEY = "ef9a9484e8ec68d89092a92a5281841e";
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
async function loadWbgtData() {
    try {
        const response = await fetch('/WBGT-JIDOU/wbgt_table_preciso.json');
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        wbgtData = await response.json();
    } catch (error) {
        console.error("Erro ao carregar os dados WBGT:", error);
    }
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
    if (document.getElementById('manual-label')) document.getElementById('manual-label').textContent = t.manualLabel;
}
function handleCalculation() {
    document.getElementById("error-message-box").classList.add("hidden");
    if (document.activeElement.id !== "get-location-weather") {
        document.getElementById('location-display').textContent = "";
        document.getElementById('get-location-weather').classList.remove('active');
    }
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = localStorage.getItem('wbgt-lang') || 'pt';
    if (isNaN(temp) || isNaN(hum)) {
        displayError(translations[lang].invalidInput);
        return;
    }
    const resultData = calculateWBGT(temp, hum);
    if (resultData.error) {
        displayError(resultData.error);
        return;
    }
    displayResult(resultData, lang);
}
function displayResult(resultData, lang) {
    const resultBox = document.getElementById("result-box");
    const resultDiv = document.getElementById("result");
    const t = translations[lang];
    const actionsLink = `<a href="acoes.html?level=${resultData.levelIdx}" class="button-link-result">${t.viewActions}</a>`;
    resultDiv.innerHTML = `WBGT: ${resultData.wbgt}°C<br><strong>${resultData.label}</strong><div style="margin-top:10px;">${actionsLink}</div>`;
    resultBox.style.backgroundColor = resultData.color;
    resultBox.classList.remove("text-light", "text-dark");
    if (resultData.color === "#538DD5" || resultData.color === "#FF0000") {
        resultBox.classList.add("text-light");
    } else {
        resultBox.classList.add("text-dark");
    }
    resultBox.classList.remove("hidden");
}
function clearAll() {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("error-message-box").classList.add("hidden");
    document.getElementById("location-display").textContent = "";
    document.getElementById('get-location-weather').classList.remove('active');
}
function displayError(message) {
    const errorBox = document.getElementById("error-message-box");
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
    document.getElementById("result-box").classList.add("hidden");
}
async function getGeolocationAndFetchWeather() {
    clearAll();
    document.getElementById('get-location-weather').classList.add('active');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                const lang = localStorage.getItem('wbgt-lang') || 'pt';
                let msgKey = 'fetchError';
                if (error.code === 1) msgKey = 'locationPermissionDenied';
                if (error.code === 2) msgKey = 'locationNotAvailable';
                if (error.code === 3) msgKey = 'locationTimeout';
                displayError(translations[lang][msgKey]);
                document.getElementById('get-location-weather').classList.remove('active');
            }
        );
    } else {
        displayError(translations[localStorage.getItem('wbgt-lang') || 'pt'].locationNotAvailable);
    }
}
async function fetchWeatherDataByCoords(lat, lon) {
    const url = `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        const lang = localStorage.getItem('wbgt-lang') || 'pt';
        document.getElementById('location-display').textContent = `${translations[lang].locationDisplayPrefix} ${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").value = data.main.temp.toFixed(1);
        document.getElementById("humidity").value = data.main.humidity;
        document.getElementById("calculate").dispatchEvent(new Event('click'));
    } catch (error) {
        displayError(translations[localStorage.getItem('wbgt-lang') || 'pt'].fetchError);
        document.getElementById('get-location-weather').classList.remove('active');
    }
}
function calculateWBGT(temp, hum) {
    const lang = localStorage.getItem('wbgt-lang') || 'pt';
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
    return { wbgt: wbgtValue, levelIdx: levelIdx, color: color, label: translations[lang].levels[levelIdx] };
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
function interpolate(x, x0, y0, x1, y1) {
    if (x1 === x0) return y0;
    return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}
