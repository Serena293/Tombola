const inputNumDiGiocatori = document.getElementById("numero-di-giocatori");
const regoleDelGioco = document.getElementById("regole-del-gioco");
const iniziaBtn = document.getElementById("btn-inizia");
const inputNumDiCartelle = document.getElementById('numero-di-cartelle')
const form = document.getElementById('form-numero-di-giocarori')

 
let numeroDiGiocatori;


const selezionaOpzioni = () => {    
    let numeroDiGiocatori = inputNumDiGiocatori.value;
    let numeroDiCartelle = inputNumDiCartelle.value;
    
    localStorage.setItem('opzioni', JSON.stringify({ numeroDiGiocatori, numeroDiCartelle }));

  
    return { numeroDiGiocatori, numeroDiCartelle };
};
console.log(selezionaOpzioni())


const regole = () => {
  regoleDelGioco.innerHTML = `<ol>
    <li>Selezionare numero di giocatori</li>
    <li>Selezionare numero di cartelle per ciascun giocatore</li>
    <li>Clicca Estrai Numero per selezionare un numero </li>
    </ol>`;
};





iniziaBtn.addEventListener('click', selezionaOpzioni())
regoleDelGioco.addEventListener("mouseover", regole);

regoleDelGioco.addEventListener("mouseout", () => {
  setTimeout(() => {
    if (!regoleDelGioco.matches(":hover")) {
      regoleDelGioco.innerHTML = "Regole del Gioco";
    }
  }, 1000);
});

// iniziaBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   window.location.href = "index.html";
// });
