export interface Move {
  from: number
  to: number
  playerId: string
  diceRoll: number
}

export interface GameState {
  board: number[] // Array representing pieces on the board
  currentPlayerId: string
  diceRolls: number[]
  // Add other game state properties as needed
}

/**
 * Validates a move according to backgammon rules.
 * @param gameState Current game state
 * @param move Move to validate
 * @returns true if valid, false otherwise
 */
export function validateMove(gameState: GameState, move: Move): boolean {
  // Basic validation example: check if 'from' and 'to' are within board range
  if (move.from < 0 || move.from >= gameState.board.length) return false
  if (move.to < 0 || move.to >= gameState.board.length) return false

  // TODO: Add full backgammon rules validation here

  return true
}

/**
 * Applies a move to the game state.
 * @param gameState Current game state
 * @param move Move to apply
 * @returns Updated game state
 */
export function applyMove(gameState: GameState, move: Move): GameState {
  // TODO: Implement move application logic

  return gameState
}
