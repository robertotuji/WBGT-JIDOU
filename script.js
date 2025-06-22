
const OPENWEATHER_API_KEY = "ef9a9484e8ec68d89092a92a5281841e";
const tableUrl = 'wbgt_table_preciso.json';

let wbgtData = {};
fetch(tableUrl)
  .then(res => res.json())
  .then(json => wbgtData = json);

window.addEventListener('DOMContentLoaded', () => {
  const locationDisplay = document.getElementById('location-display');
  const tempInput = document.getElementById('temperature');
  const humInput = document.getElementById('humidity');
  const resultBox = document.getElementById('result-box');
  const result = document.getElementById('result');
  const langSelect = document.getElementById('language-select');
  const calcBtn = document.getElementById('calculate');
  const clearBtn = document.getElementById('clear');
  const darkToggle = document.getElementById('darkmode-toggle');

  // Obter localização e preencher cidade/país, temperatura e umidade
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      try {
        const resp = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await resp.json();
        const city = data.name;
        const country = data.sys.country;
        locationDisplay.textContent = `${city}, ${country}`;
        tempInput.value = Math.round(data.main.temp);
        humInput.value = data.main.humidity;
      } catch (e) {
        console.error('Erro ao buscar clima:', e);
      }
    });
  }

  // Cálculo e exibição WBGT
  calcBtn.addEventListener('click', () => {
    const temp = String(tempInput.value);
    const hum = String(humInput.value);
    if (!wbgtData[temp] || wbgtData[temp][hum] == null) return;
    const wbgt = wbgtData[temp][hum];
    const lang = langSelect.value;

    let bg, textColor;
    if (wbgt < 21)          { bg = '#538DD5'; textColor = 'white'; }
    else if (wbgt <= 24)    { bg = '#C5D9F1'; textColor = 'black'; }
    else if (wbgt <= 27)    { bg = '#FFFF00'; textColor = 'black'; }
    else if (wbgt <= 30)    { bg = '#FFC000'; textColor = 'black'; }
    else                    { bg = '#FF0000'; textColor = 'white'; }

    const labels = {
      ja: ['ほぼ安全','注意','警戒','厳重警戒','危険'],
      pt: ['Quase seguro','Atenção','Alerta','Alerta severo','Perigo'],
      en: ['Almost Safe','Caution','Warning','Severe Alert','Danger'],
      id: ['Hampir Aman','Waspada','Siaga','Siaga Berat','Bahaya']
    };
    const idx = wbgt<21 ? 0 : wbgt<=24 ? 1 : wbgt<=27 ? 2 : wbgt<=30 ? 3 : 4;
    const label = labels[lang][idx];

    resultBox.style.display = 'block';
    resultBox.style.backgroundColor = bg;
    resultBox.style.color = textColor;
    resultBox.style.borderRadius = '10px';
    result.innerHTML = `<strong>WBGT: ${wbgt}°C</strong><br>${label}`;
  });

  // Limpar campos e localização
  clearBtn.addEventListener('click', () => {
    tempInput.value = '';
    humInput.value = '';
    resultBox.style.display = 'none';
    locationDisplay.textContent = '';
  });

  // Modo escuro
  darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkToggle.checked);
  });
});
