const tabellone = document.getElementById("tabellone");
const pulsanteEstrazione = document.getElementById("pulsanteEstrazione");
const pulsanteNuovaCartella = document.getElementById("aggiungiCartella");
const cartelleGiocatori = document.getElementById("cartelleGiocatori");

const importaOpzioni = () => {
  const giocatori = JSON.parse(localStorage.getItem("giocatori"));
  const cartelle = JSON.parse(localStorage.getItem("cartelle"));
  const nomi = JSON.parse(localStorage.getItem('nomi'))
  return { giocatori, cartelle, nomi};
};

const { giocatori, cartelle } = importaOpzioni();

const numeriEstratti = [];

const generaTabellone = () => {
  for (let i = 1; i <= 90; i++) {
    const casella = document.createElement("div");
    casella.classList.add("singolaCasella");
    casella.innerText = i;
    tabellone.appendChild(casella);
  }
};
console.log(importaOpzioni());
const casella = document.getElementsByClassName("singolaCasella");

const creaCartella = () => {
  const contenitoreCartella = document.createElement("div");
  contenitoreCartella.classList.add("contenitoreCartella");
  cartelleGiocatori.appendChild(contenitoreCartella);

  // for (let j = 1; j <= giocatori; j++) {
  //   const giocatori = document.createElement("div");
  //   giocatori.classList.add("giocatore");
  //   giocatori.innerText = "Giocatore";
  //   contenitoreCartella.append(giocatori);
  // }
  
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

generaTabellone();

pulsanteEstrazione.addEventListener("click", estraiNumero);
pulsanteNuovaCartella.addEventListener("click", creaCartella);
