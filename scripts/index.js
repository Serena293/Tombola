// Recupera le impostazioni dal localStorage
const getGameSettings = () => {
    const defaultSettings = {
        players: ['Giocatore 1'],
        cardsPerPlayer: 1,
        createdAt: new Date().toISOString()
    };
    
    const savedSettings = localStorage.getItem('tombolaSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

const { players, cardsPerPlayer } = getGameSettings();
const numeriEstratti = [];
const tabellone = document.getElementById("tabellone");
const pulsanteEstrazione = document.getElementById("pulsanteEstrazione");
const pulsanteNuovaCartella = document.getElementById("aggiungiCartella");
const cartelleGiocatori = document.getElementById("cartelleGiocatori");
const playerInfoEl = document.getElementById("player-info");

// Mostra info giocatori
playerInfoEl.innerHTML = `
    <h3>${players.length > 1 ? 'Giocatori' : 'Giocatore'}: ${players.join(', ')}</h3>
    <p>${cardsPerPlayer} cartella${cardsPerPlayer > 1 ? 'e' : ''} per giocatore</p>
`;

// Genera il tabellone
const generaTabellone = () => {
    for (let i = 1; i <= 90; i++) {
        const casella = document.createElement("div");
        casella.classList.add("singolaCasella");
        casella.textContent = i;
        tabellone.appendChild(casella);
    }
};

// Genera numeri unici per cartella
const generaNumeriCartella = () => {
    const numeri = [];
    while (numeri.length < 15) {
        const num = Math.floor(Math.random() * 90) + 1;
        if (!numeri.includes(num)) {
            numeri.push(num);
        }
    }
    return numeri.sort((a, b) => a - b);
};

// Crea una nuova cartella per un giocatore specifico
const creaCartella = (playerIndex) => {
    const contenitoreCartella = document.createElement("div");
    contenitoreCartella.classList.add("contenitoreCartella", `giocatore-${(playerIndex % 6) + 1}`);
    
    const playerName = document.createElement("div");
    playerName.classList.add("player-name");
    playerName.textContent = players[playerIndex];
    contenitoreCartella.appendChild(playerName);
    
    const numeriCartella = generaNumeriCartella();
    numeriCartella.forEach(numero => {
        const casella = document.createElement("div");
        casella.classList.add("singolaCasella");
        casella.textContent = numero;
        contenitoreCartella.appendChild(casella);
    });
    
    cartelleGiocatori.appendChild(contenitoreCartella);
};

// Estrae un numero casuale
const estraiNumero = () => {
    if (numeriEstratti.length >= 90) {
        alert("Tutti i numeri sono stati estratti!");
        pulsanteEstrazione.disabled = true;
        return;
    }

    let numeroCasuale;
    do {
        numeroCasuale = Math.floor(Math.random() * 90) + 1;
    } while (numeriEstratti.includes(numeroCasuale));

    numeriEstratti.push(numeroCasuale);
    console.log(`Estratto: ${numeroCasuale}`);

    // Evidenzia sul tabellone
    const caselleTabellone = document.querySelectorAll("#tabellone .singolaCasella");
    caselleTabellone.forEach(casella => {
        if (parseInt(casella.textContent) === numeroCasuale) {
            casella.classList.add("numeroEstratto");
        }
    });

    // Evidenzia nelle cartelle
    const cartelle = document.querySelectorAll(".contenitoreCartella");
    cartelle.forEach(cartella => {
        const caselle = cartella.querySelectorAll(".singolaCasella");
        caselle.forEach(casella => {
            if (parseInt(casella.textContent) === numeroCasuale) {
                casella.classList.add("numeroEstratto");
            }
        });
    });
};

// Crea cartelle iniziali
const creaCartelleIniziali = () => {
    for (let playerIdx = 0; playerIdx < players.length; playerIdx++) {
        for (let i = 0; i < cardsPerPlayer; i++) {
            creaCartella(playerIdx);
        }
    }
};


let currentPlayerIndex = 0;
pulsanteNuovaCartella.addEventListener("click", () => {
    creaCartella(currentPlayerIndex);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
});

const resetGame = () => {
   
    if (confirm("Sei sicuro di voler ricominciare?")) {
        
        localStorage.removeItem('tombolaSettings');
        
        // Reindirizza alla pagina iniziale
        window.location.href = 'firstPage.html';
    }
};


// Inizializzazione
generaTabellone();
creaCartelleIniziali();
pulsanteEstrazione.addEventListener("click", estraiNumero);
document.getElementById('resetGame').addEventListener('click', resetGame);