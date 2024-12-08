const inputNumDiGiocatori = document.getElementById("numero-di-giocatori");
const regoleDelGioco = document.getElementById("regole-del-gioco");
const form = document.getElementById("form-numero-di-giocarori");
const avantiBtn = document.getElementById("btn-avanti");
const mainSection = document.getElementById("main-section");

const contaNumeroGiocatori = (e) => {
  e.preventDefault(); // Prevent form submission
  const numeroDiGiocatori = parseInt(inputNumDiGiocatori.value);

  if (isNaN(numeroDiGiocatori) || numeroDiGiocatori <= 0) {
    alert("Inserisci un numero valido di giocatori!");
    return;
  }

  // Clear any previously created forms
  regoleDelGioco.innerHTML = "";

  for (let i = 0; i < numeroDiGiocatori; i++) {
    // Create a form for each player
    const numeroDiCartelle = document.createElement("form");
    numeroDiCartelle.innerHTML = `
      <label for="numero-di-cartelle-${i}">
        Seleziona numero di cartelle per Giocatore ${i + 1}:
      </label>
      <input 
        type="number" 
        max="4" 
        min="1" 
        id="numero-di-cartelle-${i}" 
        name="numero-di-cartelle-${i}"
        required 
      />
      <button type="button" id="btn-inizia-${i}" class="btn-inizia">Inizia!</button>
    `;
    regoleDelGioco.appendChild(numeroDiCartelle); // Append to container
  }

  localStorage.setItem("numGiocatori", numeroDiGiocatori);
  console.log("Numero di giocatori salvato:", numeroDiGiocatori);

  // Attach event listeners to each dynamically created button
  document.querySelectorAll(".btn-inizia").forEach((button, index) => {
    button.addEventListener("click", () => {
      const numeroCartelle = document.getElementById(`numero-di-cartelle-${index}`).value;
      console.log(`Giocatore ${index + 1} ha scelto ${numeroCartelle} cartelle.`);
    });
  });
};


avantiBtn.addEventListener("click", contaNumeroGiocatori);
