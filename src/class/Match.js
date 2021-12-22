/**
 * @typedef {import('./Player.js').default} Player
 */

export default class Match {
  opponents = [];
  winner;

  /**
   *
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB) {
    this.opponents = [playerA, playerB];
    const result = playerA.winsAgainst(playerB);
    if (result < 0) {
      this.winner = playerB;
    } else if (result > 0) {
      this.winner = playerA;
    }
  }
}
