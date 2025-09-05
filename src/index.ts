import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import type { Player } from './types.js';
import { BlackjackGame } from './blackjack-game.js';
import { loadGameSettings } from './config-loader.js';

// Get player name and create single player
async function createPlayer(): Promise<Player> {
  const rl = readline.createInterface({ input, output });
  
  console.log('🃏 Welcome to Blackjack! 🃏');
  const playerName = await rl.question('Enter your name: ');
  
  rl.close();
  
  return {
    playerId: 'player1',
    name: playerName || 'Player',
    position: 'seat1',
    startingStackSize: 10000,
    currentStackSize: 10000,
  };
}

// Start the game
async function main(): Promise<void> {
  try {
    const gameSettings = loadGameSettings();
    const player = await createPlayer();
    const players = [player];
    
    const game = new BlackjackGame(gameSettings, players);
    await game.playSession();
  } catch (error) {
    console.error('Game error:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
