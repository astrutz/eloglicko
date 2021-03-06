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
   * @param {PlayerRating} playerRatingA
   * @param {PlayerRating} playerRatingB
   */
  constructor(playerRatingA, playerRatingB, useRandom = false) {
    this.id = uuidv4();
    this.opponents = [playerRatingA, playerRatingB];
    if (playerRatingB) {
      const result = playerRatingA.player.winsAgainst(playerRatingB.player, useRandom);
      if (result < 0) {
        this.winner = playerRatingB;
        this.loser = playerRatingA;
      } else if (result > 0) {
        this.winner = playerRatingA;
        this.loser = playerRatingB;
      } else if (result === 0) {
        this.winner = undefined;
        this.loser = undefined;
      }
    } else {
      this.winner = undefined;
      this.loser = -1;
    }
  }
}
