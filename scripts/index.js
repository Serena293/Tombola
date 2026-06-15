document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const game = window.TombolaGame;
  const elements = {
    board: document.getElementById("tabellone"),
    cards: document.getElementById("cartelleGiocatori"),
    drawButton: document.getElementById("pulsanteEstrazione"),
    addCardButton: document.getElementById("aggiungiCartella"),
    resetButton: document.getElementById("resetGame"),
    playerInfo: document.getElementById("player-info"),
    lastNumber: document.getElementById("ultimoNumero"),
    drawCount: document.getElementById("draw-count"),
    history: document.getElementById("cronologia"),
    status: document.getElementById("game-status"),
    awards: document.getElementById("premi"),
    awardBanner: document.getElementById("award-banner"),
    awardTitle: document.getElementById("award-title"),
    awardText: document.getElementById("award-text"),
    closeAward: document.getElementById("close-award"),
    audioToggle: document.getElementById("audio-toggle"),
    year: document.getElementById("year"),
  };

  let storageAvailable = true;
  let audioContext = null;
  let nextPlayerForCard = 0;

  const readStorage = (key) => {
    let value;

    try {
      value = localStorage.getItem(key);
    } catch (error) {
      storageAvailable = false;
      return null;
    }

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      try {
        localStorage.removeItem(key);
      } catch (storageError) {
        storageAvailable = false;
      }

      return null;
    }
  };

  const writeState = () => {
    if (!storageAvailable) {
      return;
    }

    try {
      localStorage.setItem(game.STATE_KEY, JSON.stringify(state));
    } catch (error) {
      storageAvailable = false;
      setStatus(
        "La partita continua, ma il browser non può salvarla.",
        "warning"
      );
    }
  };

  const savedSettings = readStorage(game.SETTINGS_KEY);
  const settings = game.normalizeSettings(savedSettings);
  const savedState = readStorage(game.STATE_KEY);
  const state = game.normalizeState(savedState, settings);
  const drawnSet = () => new Set(state.drawnNumbers);

  const setStatus = (message, tone = "neutral") => {
    elements.status.textContent = message;
    elements.status.dataset.tone = tone;
  };

  const playDrawSound = () => {
    if (!elements.audioToggle.checked) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    try {
      audioContext = audioContext || new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, start);
      oscillator.frequency.exponentialRampToValueAtTime(760, start + 0.12);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.21);
    } catch (error) {
      elements.audioToggle.checked = false;
    }
  };

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  };

  const renderPlayerInfo = () => {
    const title = createElement(
      "strong",
      "",
      state.settings.players.length > 1 ? "Giocatori" : "Giocatore"
    );
    const names = createElement("span", "", state.settings.players.join(", "));
    const cardCount = createElement(
      "small",
      "",
      `${state.cards.length} cartell${state.cards.length === 1 ? "a" : "e"}`
    );

    elements.playerInfo.replaceChildren(title, names, cardCount);
  };

  const renderBoard = () => {
    const markedNumbers = drawnSet();
    const latestNumber = state.drawnNumbers.at(-1);
    const fragment = document.createDocumentFragment();

    for (let number = 1; number <= 90; number += 1) {
      const cell = createElement("div", "board-number", String(number));
      cell.setAttribute("aria-label", `Numero ${number}`);

      if (markedNumbers.has(number)) {
        cell.classList.add("is-drawn");
      }

      if (number === latestNumber) {
        cell.classList.add("is-latest");
      }

      fragment.appendChild(cell);
    }

    elements.board.replaceChildren(fragment);
  };

  const renderCards = () => {
    const markedNumbers = drawnSet();
    const fragment = document.createDocumentFragment();

    state.cards.forEach((card, cardIndex) => {
      const article = createElement(
        "article",
        `ticket player-color-${(card.playerIndex % 6) + 1}`
      );
      const header = createElement("header", "ticket-header");
      const owner = createElement(
        "h3",
        "",
        state.settings.players[card.playerIndex]
      );
      const label = createElement(
        "span",
        "",
        `Cartella ${cardIndex + 1}`
      );
      const grid = createElement("div", "ticket-grid");

      header.append(owner, label);

      card.grid.forEach((row) => {
        row.forEach((number) => {
          const cell = createElement(
            "div",
            number === null ? "ticket-cell is-empty" : "ticket-cell",
            number === null ? "" : String(number)
          );

          if (number === null) {
            cell.setAttribute("aria-hidden", "true");
          } else {
            cell.setAttribute("aria-label", `Numero ${number}`);
            if (markedNumbers.has(number)) {
              cell.classList.add("is-drawn");
            }
          }

          grid.appendChild(cell);
        });
      });

      article.append(header, grid);
      fragment.appendChild(article);
    });

    elements.cards.replaceChildren(fragment);
  };

  const formatWinner = (winner) => {
    const cardIndex = state.cards.findIndex(
      (card) => card.id === winner.cardId
    );
    const playerName = state.settings.players[winner.playerIndex];
    const rowLabel =
      winner.rowIndex === null ? "" : `, riga ${winner.rowIndex + 1}`;

    return `${playerName}, cartella ${cardIndex + 1}${rowLabel}`;
  };

  const renderAwards = () => {
    const fragment = document.createDocumentFragment();

    game.PRIZES.forEach((prize) => {
      const item = createElement("li", "prize-item");
      const label = createElement("strong", "", prize.label);
      const award = state.awards[prize.key];
      const value = createElement(
        "span",
        award ? "is-awarded" : "",
        award
          ? [...new Set(award.winners.map(formatWinner))].join("; ")
          : "Da assegnare"
      );

      item.append(label, value);
      fragment.appendChild(item);
    });

    elements.awards.replaceChildren(fragment);
  };

  const findNextEligiblePlayer = () => {
    for (let offset = 0; offset < state.settings.players.length; offset += 1) {
      const playerIndex =
        (nextPlayerForCard + offset) % state.settings.players.length;

      if (game.canAddCard(state, playerIndex)) {
        return playerIndex;
      }
    }

    return null;
  };

  const renderDrawSummary = () => {
    const latestNumber = state.drawnNumbers.at(-1);
    const recentNumbers = state.drawnNumbers.slice(-10).reverse();

    elements.lastNumber.textContent = latestNumber || "--";
    elements.drawCount.textContent = `${state.drawnNumbers.length} / 90 estratti`;
    elements.history.replaceChildren(
      ...recentNumbers.map((number) =>
        createElement("span", "history-number", String(number))
      )
    );

    if (recentNumbers.length === 0) {
      elements.history.appendChild(
        createElement("span", "history-empty", "Nessun numero estratto")
      );
    }
  };

  const renderControls = () => {
    const allNumbersDrawn = state.drawnNumbers.length >= 90;
    const nextEligiblePlayer = findNextEligiblePlayer();

    elements.drawButton.disabled = state.gameOver || allNumbersDrawn;
    elements.addCardButton.disabled = nextEligiblePlayer === null;
    elements.addCardButton.title =
      state.drawnNumbers.length > 0
        ? "Le cartelle si possono aggiungere solo prima della prima estrazione."
        : nextEligiblePlayer === null
          ? "Ogni giocatore ha già quattro cartelle."
          : `Aggiungi una cartella a ${state.settings.players[nextEligiblePlayer]}`;

    if (state.gameOver) {
      elements.drawButton.textContent = "Partita conclusa";
    } else if (allNumbersDrawn) {
      elements.drawButton.textContent = "Numeri terminati";
    } else {
      elements.drawButton.textContent = "Estrai nuovo numero";
    }
  };

  const render = () => {
    renderPlayerInfo();
    renderBoard();
    renderCards();
    renderAwards();
    renderDrawSummary();
    renderControls();
  };

  const announceAwards = (awards) => {
    if (awards.length === 0) {
      return;
    }

    const announcements = awards.map((award) => {
      const winners = [...new Set(award.winners.map(formatWinner))].join("; ");
      return `${award.label}: ${winners}`;
    });
    const hasTombola = awards.some((award) => award.key === "tombola");

    elements.awardTitle.textContent = hasTombola
      ? "Tombola!"
      : "Nuovo premio";
    elements.awardText.textContent = announcements.join(" | ");
    elements.awardBanner.hidden = false;
    setStatus(announcements.join(" | "), hasTombola ? "success" : "award");
  };

  elements.drawButton.addEventListener("click", () => {
    const number = game.drawNumber(state);

    if (number === null) {
      setStatus(
        state.gameOver
          ? "La partita è già conclusa."
          : "Tutti i numeri sono stati estratti.",
        "warning"
      );
      renderControls();
      return;
    }

    const awards = game.findNewAwards(state);
    writeState();
    render();
    playDrawSound();

    if (awards.length > 0) {
      announceAwards(awards);
    } else {
      setStatus(`È stato estratto il numero ${number}.`);
    }
  });

  elements.addCardButton.addEventListener("click", () => {
    const playerIndex = findNextEligiblePlayer();

    if (playerIndex === null) {
      setStatus(
        state.drawnNumbers.length > 0
          ? "Non puoi aggiungere cartelle dopo l'inizio delle estrazioni."
          : "Ogni giocatore ha già quattro cartelle.",
        "warning"
      );
      renderControls();
      return;
    }

    game.addCard(state, playerIndex);
    nextPlayerForCard = (playerIndex + 1) % state.settings.players.length;
    writeState();
    render();
    setStatus(
      `Cartella aggiunta a ${state.settings.players[playerIndex]}.`
    );
  });

  elements.closeAward.addEventListener("click", () => {
    elements.awardBanner.hidden = true;
  });

  elements.resetButton.addEventListener("click", () => {
    if (!window.confirm("Vuoi terminare la partita e cambiare i giocatori?")) {
      return;
    }

    try {
      localStorage.removeItem(game.SETTINGS_KEY);
      localStorage.removeItem(game.STATE_KEY);
    } catch (error) {
      // The redirect still lets the user start a new in-memory game.
    }

    window.location.href = "firstPage.html";
  });

  elements.year.textContent = new Date().getFullYear();
  writeState();
  render();

  if (!storageAvailable) {
    setStatus(
      "La partita funziona, ma non verrà ripristinata dopo un refresh.",
      "warning"
    );
  } else if (state.drawnNumbers.length > 0) {
    setStatus("Partita ripristinata dal salvataggio precedente.");
  } else {
    setStatus("La partita è pronta. Buon divertimento!");
  }
});
