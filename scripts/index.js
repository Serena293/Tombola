const tabellone = document.getElementById("tabellone");
const pulsanteEstrazione = document.getElementById("pulsanteEstrazione");
const pulsanteNuovaCartella = document.getElementById('aggiungiCartella');
const cartelleGiocatori = document.getElementById('cartelleGiocatori')

const numeriEstratti = [];
const generaTabellone = () => {
  for (let i = 1; i <= 90; i++) {
    const casella = document.createElement("div");
    casella.classList.add("singolaCasella");
    casella.innerText = i;
    tabellone.appendChild(casella);
  }
};

const casella = document.getElementsByClassName("singolaCasella");
const estraiNumero = () => {
  const numeroCasuale = Math.ceil(Math.random() * 90);

  if (numeriEstratti.includes(numeroCasuale)) {
    return estraiNumero();
  }

  numeriEstratti.push(numeroCasuale);

  for (let i = 0; i < casella.length; i++) {
    if (parseInt(casella[i].innerText) === numeroCasuale) {
      casella[i].classList.add("numeroEstratto");
      break;
    }
  }
//   console.log(numeriEstratti);
};


const creaCartella = () => {
    for (let i = 1; i <= 15; i++) {
        const casella = document.createElement("div");
        casella.classList.add("singolaCasella");
        casella.innerText = Math.ceil(Math.random() * 90);
        cartelleGiocatori.appendChild(casella);
      }
}




generaTabellone();

pulsanteEstrazione.addEventListener("click", estraiNumero);
pulsanteNuovaCartella.addEventListener('click', creaCartella)
