const tabellone = document.getElementById("tabellone");
const pulsanteEstrazione = document.getElementById("pulsanteEstrazione");
const pulsanteNuovaCartella = document.getElementById("aggiungiCartella");
const cartelleGiocatori = document.getElementById("cartelleGiocatori");



const importaOpzioni = () => {
  const giocatori = JSON.parse(localStorage.getItem('giocatori'))
 const cartelle =JSON.parse(localStorage.getItem('cartelle'))
  return {giocatori, cartelle}
}



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

const creaCartella = () => {
  const contenitoreCartella = document.createElement("div");
  contenitoreCartella.classList.add("contenitoreCartella");
  cartelleGiocatori.appendChild(contenitoreCartella);

  
  for (let i = 1; i <= 15; i++) {
    const casella = document.createElement("div");
    casella.classList.add("singolaCasella");
    casella.innerText = Math.ceil(Math.random() * 90);
    contenitoreCartella.appendChild(casella);
  }
};

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
  const cartelle = document.getElementsByClassName("contenitoreCartella");
  for (let i = 0; i < cartelle.length; i++) {
    const numeriCasella = cartelle[i].getElementsByClassName("singolaCasella");
    for (let j = 0; j < numeriCasella.length; j++) {
      if (parseInt(numeriCasella[j].innerText) === numeroCasuale) {
        numeriCasella[j].classList.add("numeroEstratto");
        break;
      }
    }
  }

  //   console.log(numeriEstratti);
};

importaOpzioni()
generaTabellone();

pulsanteEstrazione.addEventListener("click", estraiNumero);
pulsanteNuovaCartella.addEventListener("click", creaCartella);
