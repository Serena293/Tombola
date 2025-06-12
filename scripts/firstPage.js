document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('game-setup');
    const playerCountInput = document.getElementById('player-count');
    const playersContainer = document.getElementById('players-container');
    const cardsPerPlayerContainer = document.getElementById('cards-per-player-container');

    playerCountInput.addEventListener('change', (e) => {
        const numPlayers = parseInt(e.target.value);
        playersContainer.innerHTML = '';
        
        if (numPlayers > 0) {
            cardsPerPlayerContainer.style.display = 'block';
            
            for (let i = 1; i <= numPlayers; i++) {
                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label for="player-${i}">Giocatore ${i}:</label>
                    <input type="text" id="player-${i}" required>
                `;
                playersContainer.appendChild(div);
            }
        } else {
            cardsPerPlayerContainer.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const numPlayers = parseInt(playerCountInput.value);
        const cardsPerPlayer = parseInt(document.getElementById('cards-per-player').value);
        const players = [];
        
        // Raccogli nomi giocatori
        for (let i = 1; i <= numPlayers; i++) {
            const name = document.getElementById(`player-${i}`).value.trim();
            if (!name) {
                alert(`Inserisci nome per Giocatore ${i}`);
                return;
            }
            players.push(name);
        }
        
        // Salva in localStorage
        localStorage.setItem('tombolaSettings', JSON.stringify({
            players,
            numPlayers,
            cardsPerPlayer,
            createdAt: new Date().toISOString()
        }));
        
        // Reindirizza alla pagina di gioco
        window.location.href = 'index.html';
    });
});