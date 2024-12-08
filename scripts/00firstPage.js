const inputNumDiGiocatori = document.getElementById("numero-di-giocatori");
const regoleDelGioco = document.getElementById("regole-del-gioco");
// const iniziaBtn = document.getElementById("btn-inizia");
// const inputNumDiCartelle = document.getElementById('numero-di-cartelle') aggiungere dopo, generare con js
const form = document.getElementById("form-numero-di-giocarori");
const avantiBtn = document.getElementById("btn-avanti");

let avantiClick = 0;

const selezionaOpzioni = () => {
  const numeroDiGiocatori = inputNumDiGiocatori.value;
  // const numeroDiCartelle = inputNumDiCartelle.value
  const nomi = [];

  const giocatoriNomi = document.getElementsByClassName(
    "input-nomeDelGiocatore"
  );
  for (let i = 0; i < giocatoriNomi.length; i++) {
    const nomeGiocatore = giocatoriNomi[i].value;
    if (giocatoriNomi[i].value === "") break;
    else {
      nomi.push(nomeGiocatore);
    }
  }
  localStorage.setItem("nomi", JSON.stringify(nomi));
  localStorage.setItem("giocatori", JSON.stringify(numeroDiGiocatori));
   localStorage.setItem('cartelle',JSON.stringify(numeroDiCartelle))
};

const importaOpzioni = () => {
  const giocatori = JSON.parse(localStorage.getItem("giocatori"));
  const nomi = JSON.parse(localStorage.getItem("nomi"));
  const cartelle = JSON.parse(localStorage.getItem("cartelle"));
  return { giocatori, nomi, cartelle };
};

// const { giocatori, cartelle } = importaOpzioni();

const creaInputNomeDeiGiocatori = (giocatori) => {
  const divNomiDeiGiocatori = document.getElementById("div-nomi-dei-giocatori");
  divNomiDeiGiocatori.innerHTML = "";
  for (let i = 0; i < giocatori; i++) {
    const nomeDelGiocatore = document.createElement("input");
    nomeDelGiocatore.classList.add("input-nomeDelGiocatore");
    nomeDelGiocatore.setAttribute("id", `nomeGiocatore${i}`);
    nomeDelGiocatore.setAttribute("required", "");
    nomeDelGiocatore.placeholder = "Inserici nome";
    divNomiDeiGiocatori.appendChild(nomeDelGiocatore);

    const label = document.createElement("label");
    label.setAttribute("for", `nomeGiocatore${i}`);
    label.innerText = `Giocatore ${i + 1}`;
    divNomiDeiGiocatori.appendChild(label);
  }
};

const cartelle = () => {
  const nomeDelGiocatore = document.querySelector("input-nomeDelGiocatore");
  if (nomeDelGiocatore !== 0) {


    const label = document.createElement("label");
    label.setAttribute("for", "numero-di-cartelle-input");
    label.innerText = "Seleziona numero di cartelle";
    form.appendChild(label);
  }

    const inputNumeroCartelle = document.createElement("input");
    inputNumeroCartelle.setAttribute("type", "number");
    inputNumeroCartelle.setAttribute("id", "numero-di-cartelle-input");
    inputNumeroCartelle.setAttribute("min", "1");
    inputNumeroCartelle.setAttribute("max", "4");
    form.appendChild(inputNumeroCartelle);

};

const creaIniziaBtn = () => {
  const iniziaBtn = document.createElement("button");
  iniziaBtn.classList.add('inizia-Btn')
  iniziaBtn.setAttribute('id','inizia-btn')
  iniziaBtn.innerText = 'Inizia!'
  form.appendChild(iniziaBtn)


  iniziaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selezionaOpzioni()
    window.location.href = "index.html";
  });
};
const regole = () => {
  regoleDelGioco.innerHTML = `<ol>
    <li>Selezionare numero di giocatori</li>
    <li>Selezionare numero di cartelle per ciascun giocatore</li>
    <li>Clicca Estrai Numero per selezionare un numero </li>
    </ol>`;
};

// iniziaBtn.addEventListener('click', selezionaOpzioni)
regoleDelGioco.addEventListener("mouseover", regole);

regoleDelGioco.addEventListener("mouseout", () => {
  setTimeout(() => {
    if (!regoleDelGioco.matches(":hover")) {
      regoleDelGioco.innerHTML = "Regole del Gioco";
    }
  }, 1000);
});
importaOpzioni();



avantiBtn.addEventListener("click", (e) => {
  e.preventDefault();
  avantiClick++;

  if (avantiClick === 1) {
    const numeroDiGiocatori = parseInt(inputNumDiGiocatori.value);
    if (!isNaN(numeroDiGiocatori) && numeroDiGiocatori > 0) {
      selezionaOpzioni();
      creaInputNomeDeiGiocatori(numeroDiGiocatori);
    } else {
      console.log("Please enter a valid number of players.");
    }
  } else if (avantiClick === 2 && inputNumDiGiocatori.value !== "") {
    cartelle();
  } else if (avantiClick === 3) {
    const inputNumeroCartelle = document.getElementById("numero-di-cartelle-input");
    if (inputNumeroCartelle && inputNumeroCartelle.value !== "") {
      creaIniziaBtn();
      avantiClick = 0; 
    }
  }
  
}
);

const iniziaBtn = document.getElementById('inizia-btn')
// console.log(importaOpzioni());
