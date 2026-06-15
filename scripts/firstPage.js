document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const game = window.TombolaGame;
  const form = document.getElementById("game-setup");
  const playerCountInput = document.getElementById("player-count");
  const playersContainer = document.getElementById("players-container");
  const cardsPerPlayerContainer = document.getElementById(
    "cards-per-player-container"
  );
  const setupMessage = document.getElementById("setup-message");

  const showMessage = (message, isError = false) => {
    setupMessage.textContent = message;
    setupMessage.classList.toggle("error-message", isError);
  };

  const readPlayerNames = () =>
    Array.from(playersContainer.querySelectorAll("input")).map(
      (input) => input.value
    );

  const renderPlayerInputs = () => {
    const existingNames = readPlayerNames();
    const playerCount = Number.parseInt(playerCountInput.value, 10);

    playersContainer.replaceChildren();

    if (
      !Number.isInteger(playerCount) ||
      playerCount < 1 ||
      playerCount > game.MAX_PLAYERS
    ) {
      cardsPerPlayerContainer.hidden = true;
      showMessage(
        `Inserisci un numero di giocatori tra 1 e ${game.MAX_PLAYERS}.`,
        playerCountInput.value !== ""
      );
      return;
    }

    cardsPerPlayerContainer.hidden = false;
    showMessage("Ogni giocatore può avere da 1 a 4 cartelle.");

    for (let index = 0; index < playerCount; index += 1) {
      const group = document.createElement("div");
      const label = document.createElement("label");
      const input = document.createElement("input");

      group.className = "form-group player-field";
      label.htmlFor = `player-${index + 1}`;
      label.textContent = `Nome giocatore ${index + 1}`;
      input.type = "text";
      input.id = `player-${index + 1}`;
      input.name = `player-${index + 1}`;
      input.maxLength = 40;
      input.autocomplete = "off";
      input.required = true;
      input.value = existingNames[index] || "";

      group.append(label, input);
      playersContainer.appendChild(group);
    }
  };

  playerCountInput.addEventListener("input", renderPlayerInputs);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const playerCount = Number.parseInt(playerCountInput.value, 10);
    const cardsPerPlayerInput = document.getElementById("cards-per-player");
    const cardsPerPlayer = Number.parseInt(cardsPerPlayerInput.value, 10);

    if (
      !Number.isInteger(playerCount) ||
      playerCount < 1 ||
      playerCount > game.MAX_PLAYERS
    ) {
      showMessage("Il numero di giocatori non è valido.", true);
      playerCountInput.focus();
      return;
    }

    if (
      !Number.isInteger(cardsPerPlayer) ||
      cardsPerPlayer < 1 ||
      cardsPerPlayer > game.MAX_CARDS_PER_PLAYER
    ) {
      showMessage("Il numero di cartelle non è valido.", true);
      cardsPerPlayerInput.focus();
      return;
    }

    const players = readPlayerNames().map((name) => name.trim());

    if (
      players.length !== playerCount ||
      players.some((name) => name.length === 0)
    ) {
      showMessage("Inserisci il nome di tutti i giocatori.", true);
      form.reportValidity();
      return;
    }

    const settings = {
      players,
      cardsPerPlayer,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(game.SETTINGS_KEY, JSON.stringify(settings));
      localStorage.removeItem(game.STATE_KEY);
    } catch (error) {
      showMessage(
        "Il browser non permette di salvare la partita. Controlla le impostazioni sulla privacy.",
        true
      );
      return;
    }

    window.location.href = "index.html";
  });
});
