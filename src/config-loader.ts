import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { GameSettings } from './types.js';

/**
 * Loads game settings from the blackjack-rules.json file
 * @returns Promise<GameSettings> The loaded game settings
 */
export function loadGameSettings(): GameSettings {
  try {
    const configPath = resolve(process.cwd(), 'blackjack-rules.json');
    const configData = readFileSync(configPath, 'utf-8');
    const settings = JSON.parse(configData) as GameSettings;
    
    // Validate required fields
    if (!settings.gameType || settings.gameType !== 'Blackjack') {
      throw new Error('Invalid game type in configuration');
    }
    
    if (typeof settings.minBet !== 'number' || settings.minBet <= 0) {
      throw new Error('Invalid minBet in configuration');
    }
    
    if (typeof settings.maxBet !== 'number' || settings.maxBet <= settings.minBet) {
      throw new Error('Invalid maxBet in configuration');
    }
    
    if (typeof settings.numOfDecks !== 'number' || settings.numOfDecks < 1 || settings.numOfDecks > 8) {
      throw new Error('Invalid numOfDecks in configuration (must be 1-8)');
    }
    
    if (typeof settings.payoutBlackjack !== 'number' || settings.payoutBlackjack <= 0) {
      throw new Error('Invalid payoutBlackjack in configuration');
    }
    
    if (typeof settings.maxSplits !== 'number' || settings.maxSplits < 0 || settings.maxSplits > 4) {
      throw new Error('Invalid maxSplits in configuration (must be 0-4)');
    }
    
    console.log('✅ Game settings loaded successfully from blackjack-rules.json');
    return settings;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error loading game settings:', error.message);
    } else {
      console.error('❌ Unknown error loading game settings');
    }
    throw error;
  }
}

/**
 * Creates a deep copy of game settings for session data
 * @param settings The original game settings
 * @returns A deep copy of the game settings
 */
export function copyGameSettings(settings: GameSettings): GameSettings {
  return JSON.parse(JSON.stringify(settings));
}
