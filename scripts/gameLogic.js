(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.TombolaGame = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SETTINGS_KEY = "tombolaSettings";
  const STATE_KEY = "tombolaGameState";
  const STATE_VERSION = 1;
  const MAX_PLAYERS = 10;
  const MAX_CARDS_PER_PLAYER = 4;
  const PRIZES = [
    { key: "ambo", label: "Ambo", size: 2 },
    { key: "terno", label: "Terno", size: 3 },
    { key: "quaterna", label: "Quaterna", size: 4 },
    { key: "cinquina", label: "Cinquina", size: 5 },
    { key: "tombola", label: "Tombola", size: 15 },
  ];

  const defaultSettings = () => ({
    players: ["Giocatore 1"],
    cardsPerPlayer: 1,
  });

  const clampRandom = (random) => {
    const value = Number(random());

    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.min(0.999999999, Math.max(0, value));
  };

  const randomIndex = (length, random) =>
    Math.floor(clampRandom(random) * length);

  const shuffle = (values, random = Math.random) => {
    const result = [...values];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = randomIndex(index + 1, random);
      [result[index], result[target]] = [result[target], result[index]];
    }

    return result;
  };

  const normalizeSettings = (value) => {
    if (!value || !Array.isArray(value.players)) {
      return defaultSettings();
    }

    const players = value.players
      .slice(0, MAX_PLAYERS)
      .map((player) => String(player).trim().slice(0, 40))
      .filter(Boolean);
    const parsedCards = Number.parseInt(value.cardsPerPlayer, 10);
    const cardsPerPlayer =
      Number.isInteger(parsedCards) &&
      parsedCards >= 1 &&
      parsedCards <= MAX_CARDS_PER_PLAYER
        ? parsedCards
        : 1;

    return players.length > 0
      ? { players, cardsPerPlayer }
      : defaultSettings();
  };

  const settingsSignature = (settings) =>
    JSON.stringify(normalizeSettings(settings));

  const getColumnRange = (columnIndex) => {
    if (columnIndex === 0) {
      return { start: 1, end: 9 };
    }

    if (columnIndex === 8) {
      return { start: 80, end: 90 };
    }

    return {
      start: columnIndex * 10,
      end: columnIndex * 10 + 9,
    };
  };

  const createTicketPattern = (random = Math.random) => {
    const pattern = Array.from({ length: 3 }, () => Array(9).fill(false));
    const columns = shuffle(
      Array.from({ length: 9 }, (_, index) => index),
      random
    );

    for (let row = 0; row < 3; row += 1) {
      columns.slice(row * 3, row * 3 + 3).forEach((column) => {
        pattern[row][column] = true;
      });
    }

    shuffle([0, 1, 2], random).forEach((row) => {
      const availableColumns = shuffle(
        Array.from({ length: 9 }, (_, index) => index).filter(
          (column) => !pattern[row][column]
        ),
        random
      );

      availableColumns.slice(0, 2).forEach((column) => {
        pattern[row][column] = true;
      });
    });

    return pattern;
  };

  const createCardGrid = (random = Math.random) => {
    const pattern = createTicketPattern(random);
    const grid = Array.from({ length: 3 }, () => Array(9).fill(null));

    for (let column = 0; column < 9; column += 1) {
      const rows = [0, 1, 2].filter((row) => pattern[row][column]);
      const { start, end } = getColumnRange(column);
      const availableNumbers = Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
      );
      const numbers = shuffle(availableNumbers, random)
        .slice(0, rows.length)
        .sort((a, b) => a - b);

      rows.forEach((row, index) => {
        grid[row][column] = numbers[index];
      });
    }

    return grid;
  };

  const validateCardGrid = (grid) => {
    if (
      !Array.isArray(grid) ||
      grid.length !== 3 ||
      grid.some((row) => !Array.isArray(row) || row.length !== 9)
    ) {
      return false;
    }

    const numbers = [];

    for (let row = 0; row < 3; row += 1) {
      const rowNumbers = grid[row].filter((value) => value !== null);

      if (
        rowNumbers.length !== 5 ||
        rowNumbers.some((value) => !Number.isInteger(value))
      ) {
        return false;
      }

      numbers.push(...rowNumbers);
    }

    if (numbers.length !== 15 || new Set(numbers).size !== 15) {
      return false;
    }

    for (let column = 0; column < 9; column += 1) {
      const { start, end } = getColumnRange(column);
      const columnNumbers = grid
        .map((row) => row[column])
        .filter((value) => value !== null);

      if (
        columnNumbers.length === 0 ||
        columnNumbers.some((value) => value < start || value > end)
      ) {
        return false;
      }

      for (let index = 1; index < columnNumbers.length; index += 1) {
        if (columnNumbers[index - 1] >= columnNumbers[index]) {
          return false;
        }
      }
    }

    return true;
  };

  const countCardsForPlayer = (state, playerIndex) =>
    state.cards.filter((card) => card.playerIndex === playerIndex).length;

  const canAddCard = (state, playerIndex) =>
    state.drawnNumbers.length === 0 &&
    Number.isInteger(playerIndex) &&
    playerIndex >= 0 &&
    playerIndex < state.settings.players.length &&
    countCardsForPlayer(state, playerIndex) < MAX_CARDS_PER_PLAYER;

  const addCard = (state, playerIndex, random = Math.random) => {
    if (!canAddCard(state, playerIndex)) {
      return null;
    }

    const card = {
      id: `card-${state.nextCardId}`,
      playerIndex,
      grid: createCardGrid(random),
    };

    state.nextCardId += 1;
    state.cards.push(card);
    return card;
  };

  const createInitialState = (settings, random = Math.random) => {
    const normalizedSettings = normalizeSettings(settings);
    const state = {
      version: STATE_VERSION,
      settings: normalizedSettings,
      drawnNumbers: [],
      cards: [],
      awards: Object.fromEntries(PRIZES.map((prize) => [prize.key, null])),
      nextCardId: 1,
      gameOver: false,
    };

    normalizedSettings.players.forEach((_, playerIndex) => {
      for (
        let cardIndex = 0;
        cardIndex < normalizedSettings.cardsPerPlayer;
        cardIndex += 1
      ) {
        addCard(state, playerIndex, random);
      }
    });

    return state;
  };

  const normalizeState = (value, settings, random = Math.random) => {
    const normalizedSettings = normalizeSettings(settings);

    if (
      !value ||
      value.version !== STATE_VERSION ||
      settingsSignature(value.settings) !== settingsSignature(normalizedSettings)
    ) {
      return createInitialState(normalizedSettings, random);
    }

    const drawnNumbers = Array.isArray(value.drawnNumbers)
      ? value.drawnNumbers.filter(
          (number, index, values) =>
            Number.isInteger(number) &&
            number >= 1 &&
            number <= 90 &&
            values.indexOf(number) === index
        )
      : [];
    const cards = Array.isArray(value.cards)
      ? value.cards.filter(
          (card) =>
            card &&
            typeof card.id === "string" &&
            Number.isInteger(card.playerIndex) &&
            card.playerIndex >= 0 &&
            card.playerIndex < normalizedSettings.players.length &&
            validateCardGrid(card.grid)
        )
      : [];

    if (cards.length === 0) {
      return createInitialState(normalizedSettings, random);
    }

    const awards = Object.fromEntries(
      PRIZES.map((prize) => [
        prize.key,
        value.awards && value.awards[prize.key]
          ? value.awards[prize.key]
          : null,
      ])
    );
    const highestCardId = cards.reduce((highest, card) => {
      const parsedId = Number.parseInt(card.id.replace("card-", ""), 10);
      return Number.isInteger(parsedId) ? Math.max(highest, parsedId) : highest;
    }, 0);

    return {
      version: STATE_VERSION,
      settings: normalizedSettings,
      drawnNumbers,
      cards,
      awards,
      nextCardId: Math.max(highestCardId + 1, Number(value.nextCardId) || 1),
      gameOver: Boolean(awards.tombola),
    };
  };

  const drawNumber = (state, random = Math.random) => {
    if (state.gameOver || state.drawnNumbers.length >= 90) {
      return null;
    }

    const drawn = new Set(state.drawnNumbers);
    const remainingNumbers = Array.from(
      { length: 90 },
      (_, index) => index + 1
    ).filter((number) => !drawn.has(number));
    const number = remainingNumbers[randomIndex(remainingNumbers.length, random)];

    state.drawnNumbers.push(number);
    return number;
  };

  const countMarkedInRow = (grid, rowIndex, drawnNumbers) =>
    grid[rowIndex].filter(
      (number) => number !== null && drawnNumbers.has(number)
    ).length;

  const countMarkedInCard = (grid, drawnNumbers) =>
    grid.flat().filter(
      (number) => number !== null && drawnNumbers.has(number)
    ).length;

  const findNewAwards = (state) => {
    const drawnNumbers = new Set(state.drawnNumbers);
    const lastNumber = state.drawnNumbers.at(-1) || null;
    const newAwards = [];

    PRIZES.forEach((prize) => {
      if (state.awards[prize.key]) {
        return;
      }

      const winners = [];

      state.cards.forEach((card) => {
        if (prize.key === "tombola") {
          if (countMarkedInCard(card.grid, drawnNumbers) === 15) {
            winners.push({
              cardId: card.id,
              playerIndex: card.playerIndex,
              rowIndex: null,
            });
          }
          return;
        }

        for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
          if (
            countMarkedInRow(card.grid, rowIndex, drawnNumbers) >= prize.size
          ) {
            winners.push({
              cardId: card.id,
              playerIndex: card.playerIndex,
              rowIndex,
            });
          }
        }
      });

      if (winners.length > 0) {
        const award = {
          key: prize.key,
          label: prize.label,
          number: lastNumber,
          winners,
        };

        state.awards[prize.key] = award;
        newAwards.push(award);
      }
    });

    if (state.awards.tombola) {
      state.gameOver = true;
    }

    return newAwards;
  };

  return {
    SETTINGS_KEY,
    STATE_KEY,
    STATE_VERSION,
    MAX_PLAYERS,
    MAX_CARDS_PER_PLAYER,
    PRIZES,
    normalizeSettings,
    createCardGrid,
    validateCardGrid,
    createInitialState,
    normalizeState,
    drawNumber,
    findNewAwards,
    addCard,
    canAddCard,
    countCardsForPlayer,
  };
});
