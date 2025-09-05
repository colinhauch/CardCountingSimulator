# Card Counter Simulator

A TypeScript-based blackjack session simulator and analyzer.

## Setup

This project uses modern TypeScript with strict type checking and ESLint/Prettier for code quality.

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

## Development

### Available Scripts

- `npm run dev` - Run the project in development mode with hot reload
- `npm run build` - Build the project to JavaScript
- `npm run type-check` - Check TypeScript types without emitting files
- `npm run lint` - Lint the codebase
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Project Structure

```
src/
├── types.ts           # TypeScript interfaces for blackjack sessions
├── session-utils.ts   # Utilities for loading, validating, and analyzing sessions
└── index.ts          # Main entry point
```

## Data Structure

The project defines comprehensive TypeScript interfaces for blackjack session data:

### Main Types

- `BlackjackSession` - Complete session with settings, players, and hands
- `Hand` - Individual hand with dealer and player actions
- `PlayerAction` - Player's complete action for a hand (includes splits)
- `GameSettings` - Blackjack game configuration
- `Player` - Player information and stack sizes

### Example Usage

```typescript
import { BlackjackSession, validateSession } from './types.js';
import { loadSessionFromFile, generateSessionSummary } from './session-utils.js';

// Load session from JSON
const session = await loadSessionFromFile('./sessions.json');

// Generate statistics
const summary = generateSessionSummary(session);
console.log(`Session ${summary.sessionId} had ${summary.totalHands} hands`);
```

## Features

- **Strict TypeScript** - Full type safety for blackjack data
- **Data Validation** - Runtime validation of session JSON
- **Session Analysis** - Calculate player statistics and session summaries
- **Hand Replay** - Complete data capture for exact hand reconstruction
- **Split Handling** - Proper modeling of split hands with multiple outcomes
- **Deck Tracking** - Card counting metrics and penetration tracking

## Configuration

### TypeScript

- Uses modern ES2022 features
- Strict type checking enabled
- Module resolution optimized for bundlers
- Source maps and declarations generated

### ESLint

- TypeScript-aware linting
- Enforces best practices
- Catches potential runtime errors

### Prettier

- Consistent code formatting
- Single quotes, semicolons
- 100 character line length

## JSON Structure

The `sessions.json` file contains a complete blackjack session with:

- Game settings (rules, betting limits, deck configuration)
- Player information (names, positions, stack sizes)
- Hand-by-hand records with:
  - Dealer cards and outcomes
  - Player initial cards, actions, and results
  - Split hand handling
  - Betting and payout tracking
  - Deck state (cards remaining, penetration)

This structure enables:
- Exact hand replay for analysis
- Player performance tracking
- Card counting simulation
- Game rule impact analysis
