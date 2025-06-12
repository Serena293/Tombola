# 🎱 Tombola Web Game

A fun, browser-based version of the classic Italian game **Tombola**, built with **HTML**, **CSS**, and **JavaScript**. You can play with multiple players, assign custom names, and generate random cards. Perfect for friends and family!

## 🎮 Features

- 🎲 Interactive number drawing with animated effects
- 👥 Custom player setup: choose number of players and enter their names
- 🃏 Select how many cards per player (1 or more)
- 📋 Automatically generated cards with 15 unique numbers each
- 🧠 Numbers are highlighted both on the board and player cards
- 🔊 Sound effect when drawing a number
- 🏆 Auto-detects when a player completes a card (TOMBOLA!)
- 💾 Game settings saved in `localStorage`
- 📅 Dynamic year displayed in footer


## 🚀 How to Run

1. Clone or download the repository

2. Open `firstPage.html` in your browser

3. Set:
   - Number of players
   - Player names
   - Cards per player

4. Click **Start Game** — this will take you to `index.html`

5. Click the **"Estrai numero"** button to begin drawing numbers

6. Players can follow the game on screen; when a card is fully marked, a popup announces **TOMBOLA! 🎉**

## 🔊 Sound

The game includes a sound when drawing a number. It uses: 

``js
const soundEstrazione = new Howl({
  src: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg']
});

Created by Serena
