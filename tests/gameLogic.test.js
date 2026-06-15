const test = require("node:test");
const assert = require("node:assert/strict");
const game = require("../scripts/gameLogic.js");

const validGrid = [
  [1, 10, 20, 30, 40, null, null, null, null],
  [2, null, null, 31, null, 50, 60, 70, null],
  [null, 11, 21, null, 41, null, 61, null, 80],
];

test("normalizza impostazioni e applica i limiti", () => {
  const settings = game.normalizeSettings({
    players: ["  Anna  ", "", "Luca"],
    cardsPerPlayer: 8,
  });

  assert.deepEqual(settings, {
    players: ["Anna", "Luca"],
    cardsPerPlayer: 1,
  });
});

test("genera cartelle italiane 3 x 9 valide", () => {
  for (let index = 0; index < 500; index += 1) {
    assert.equal(game.validateCardGrid(game.createCardGrid()), true);
  }
});

test("crea il numero corretto di cartelle iniziali", () => {
  const state = game.createInitialState({
    players: ["Anna", "Luca", "Marta"],
    cardsPerPlayer: 2,
  });

  assert.equal(state.cards.length, 6);
  assert.deepEqual(
    state.cards.map((card) => card.playerIndex),
    [0, 0, 1, 1, 2, 2]
  );
});

test("estrae tutti i 90 numeri senza duplicati", () => {
  const state = game.createInitialState({
    players: ["Anna"],
    cardsPerPlayer: 1,
  });

  for (let index = 0; index < 90; index += 1) {
    assert.notEqual(game.drawNumber(state, () => 0), null);
  }

  assert.equal(new Set(state.drawnNumbers).size, 90);
  assert.equal(game.drawNumber(state, () => 0), null);
});

test("consente nuove cartelle solo prima della prima estrazione e fino a quattro", () => {
  const state = game.createInitialState({
    players: ["Anna"],
    cardsPerPlayer: 1,
  });

  assert.ok(game.addCard(state, 0));
  assert.ok(game.addCard(state, 0));
  assert.ok(game.addCard(state, 0));
  assert.equal(game.addCard(state, 0), null);
  assert.equal(game.countCardsForPlayer(state, 0), 4);

  const secondState = game.createInitialState({
    players: ["Anna"],
    cardsPerPlayer: 1,
  });
  game.drawNumber(secondState, () => 0);

  assert.equal(game.addCard(secondState, 0), null);
});

test("assegna ogni premio subito e una sola volta", () => {
  const state = game.createInitialState({
    players: ["Anna"],
    cardsPerPlayer: 1,
  });
  state.cards[0].grid = validGrid;

  const prizeSequence = [
    [1, []],
    [10, ["ambo"]],
    [20, ["terno"]],
    [30, ["quaterna"]],
    [40, ["cinquina"]],
  ];

  prizeSequence.forEach(([number, expectedPrizes]) => {
    state.drawnNumbers.push(number);
    assert.deepEqual(
      game.findNewAwards(state).map((award) => award.key),
      expectedPrizes
    );
  });

  [2, 31, 50, 60, 70, 11, 21, 41, 61, 80].forEach((number, index, values) => {
    state.drawnNumbers.push(number);
    const awards = game.findNewAwards(state);

    if (index === values.length - 1) {
      assert.deepEqual(
        awards.map((award) => award.key),
        ["tombola"]
      );
    } else {
      assert.deepEqual(awards, []);
    }
  });

  assert.equal(state.gameOver, true);
  assert.deepEqual(game.findNewAwards(state), []);
  assert.equal(game.drawNumber(state), null);
});

test("ripristina una partita valida senza rigenerare le cartelle", () => {
  const settings = { players: ["Anna", "Luca"], cardsPerPlayer: 1 };
  const originalState = game.createInitialState(settings);
  originalState.drawnNumbers.push(12, 45, 78);

  const restoredState = game.normalizeState(
    JSON.parse(JSON.stringify(originalState)),
    settings
  );

  assert.deepEqual(restoredState.drawnNumbers, [12, 45, 78]);
  assert.deepEqual(restoredState.cards, originalState.cards);
});

test("sostituisce uno stato incompatibile con una nuova partita", () => {
  const settings = { players: ["Anna"], cardsPerPlayer: 1 };
  const restoredState = game.normalizeState(
    {
      version: game.STATE_VERSION,
      settings: { players: ["Altro"], cardsPerPlayer: 1 },
      drawnNumbers: [1],
      cards: [],
    },
    settings
  );

  assert.deepEqual(restoredState.drawnNumbers, []);
  assert.equal(restoredState.cards.length, 1);
  assert.equal(game.validateCardGrid(restoredState.cards[0].grid), true);
});
