/**
 * @typedef {import('./PlayerRating.js').default} PlayerRating
 */

import { v4 as uuidv4 } from "uuid";

export default class Match {
  id = '';
  opponents = [];
  winner;
  loser;

  /**
   *
   * @param {PlayerRating} playerA
   * @param {PlayerRating} playerB
   */
  constructor(playerA, playerB) {
    this.id = uuidv4();
    this.opponents = [playerA, playerB];
    const result = playerA.player.winsAgainst(playerB.player);
    if (result < 0) {
      this.winner = playerB;
      this.loser = playerA;
    } else if (result > 0) {
      this.winner = playerA;
      this.loser = playerB;
    }
  }
}
