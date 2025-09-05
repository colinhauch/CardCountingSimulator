import { writeFileSync } from 'fs';
import { resolve } from 'path';
import type { BlackjackSession } from './types.js';

/**
 * Saves a blackjack session to a JSON file
 * @param session The blackjack session to save
 * @param filename The filename to save to (will be saved in the workspace root)
 */
export async function saveSessionToFile(session: BlackjackSession, filename: string): Promise<void> {
  try {
    const filePath = resolve(process.cwd(), filename);
    const sessionData = JSON.stringify(session, null, 2);
    writeFileSync(filePath, sessionData, 'utf-8');
    console.log(`Session successfully saved to ${filename}`);
  } catch (error) {
    console.error('Error saving session to file:', error);
    throw error;
  }
}

/**
 * Loads a blackjack session from a JSON file
 * @param filename The filename to load from (will be loaded from the workspace root)
 * @returns The loaded blackjack session
 */
export async function loadSessionFromFile(filename: string): Promise<BlackjackSession> {
  try {
    const filePath = resolve(process.cwd(), filename);
    const { readFileSync } = await import('fs');
    const sessionData = readFileSync(filePath, 'utf-8');
    const session = JSON.parse(sessionData) as BlackjackSession;
    console.log(`Session successfully loaded from ${filename}`);
    return session;
  } catch (error) {
    console.error('Error loading session from file:', error);
    throw error;
  }
}
