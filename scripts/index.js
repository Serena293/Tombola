const tabellone = document.getElementById("tabellone");
const pulsanteEstrazione = document.getElementById("pulsanteEstrazione");

const generaTabellone = () => {
  for (let i = 1; i <= 90; i++) {
    const casella = document.createElement("div");
    casella.classList.add("singolaCasella");
    casella.innerText = i;
    tabellone.appendChild(casella);
  }
};

const estraiNumero = () => {
  const numeroCasuale = Math.ceil(Math.random() * 90);
  const casella = document.getElementsByClassName("singolaCasella");
  for (let i = 0; i < casella.length; i++) {
    if (parseInt(casella[i].innerText) === numeroCasuale) {
      casella[i].classList.add("numeroEstratto");
    }
  }
};

generaTabellone();

pulsanteEstrazione.addEventListener("click", estraiNumero);
