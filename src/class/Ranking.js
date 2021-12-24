import PlayerRating from "./PlayerRating.js";

/**
 * @typedef {import('./Player.js').default} Player
 */

export default class Ranking {
  /**
   * @type {[Player]}
   */
  players = [];

  /**
   * @type {[PlayerRating]}
   */
  playerRatings = [];

  /**
   * @type {number}
   */
  defaultInitialRating = 100;

  /**
   * Add a player to this ranking and automatically add a player rating to keep his history
   * The players list will always keep a descending order of strength
   * The playerRatings list is unordered. It can be sorted with the sortPlayerRatingsBy[]() methods or
   * truely randomized by calling randomizePlayerRatingsOrder().
   * @param {Player} player The player to add
   * @param {number} [initialRating=this.defaultInitialRating] Initial Rating for the Player Rating in this ranking
   */
  addPlayer(player, initialRating = this.defaultInitialRating) {
    this.playerRatings.push(new PlayerRating(player, initialRating));
    this.players.push(player);
    this.players.sort((a, b) => b.winsAgainst(a));
  }

  /**
   * Gets the PlayerRating for a given player
   * @param {Player} player player to find
   * @returns {PlayerRating|undefined} The PlayerRating if it exists, else undefined
   */
  getPlayerRatingForPlayer(player) {
    return this.playerRatings.find((p) => p === player);
  }

  /**
   * Find all cases where the current order doesn't match the order given by strength
   * @returns {[{
   *  playerRating: PlayerRating,
   *  currentPosition: number,
   *  strengthPosition: number
   * }]} All deviations from the expected order
   */
  getDeviationsFromStrenghtRating() {
    const deviations = [];

    for (const playerRating of this.playerRatings) {
      const currentPosition = this.getPlayerCurrentPosition(
        playerRating.player
      );
      const strengthPosition = this.getPlayerExpectedPosition(
        playerRating.player
      );
      if (strengthPosition !== currentPosition) {
        deviations.push({
          playerRating,
          currentPosition,
          strengthPosition,
        });
      }
    }

    return deviations;
  }

  /**
   * Calculates the expected position of a player.
   * If two or more players share a strength rating, they all get the lowest ranking of them
   * So  the following strengths
   *  [10, 9, 9, 8, 7, 5, 5, 5, 4]
   * would result in a positions list
   *  [ 1, 3, 3, 4, 5, 8, 8, 8, 9]
   *
   * So if you'd ask for the expected position of a player with thrength 5, you'd get 8.
   * @param {Player} player The player to get the position of
   * @returns {number} the expected position
   */
  getPlayerExpectedPosition(player) {
    let currentPosition = this.players.length;
    let currentPlayer;
    for (let i = this.players.length - 1; i >= 0; i--) {
      const cPlayer = this.players[i];
      if (cPlayer.winsAgainst(currentPlayer) !== 0) {
        currentPlayer = cPlayer;
        currentPosition--;
      }
      if (cPlayer === player) {
        return currentPosition;
      }
    }
  }

  /**
   * Acts like getPlayerExpectedPosition(), but does the same for the real current position.
   * This method expects this.playerRatings to be in the order of sortPlayerRatingsByCurrentRatingDesc().
   * @param {Player} player the player to find the current position for
   * @returns {number} the current position
   */
  getPlayerCurrentPosition(player) {
    let currentPosition = this.playerRatings.length;
    let currentPlayerRating;
    for (let i = this.playerRatings.length - 1; i >= 0; i--) {
      const playerRating = this.playerRatings[i];
      if (playerRating.player.winsAgainst(currentPlayerRating) !== 0) {
        currentPlayerRating = playerRating;
        currentPosition--;
      }
      if (playerRating.player === player) {
        return currentPosition;
      }
    }
  }

  /**
   * Use the modern Fisher-Yates Shuffle to randomize the order of the list
   * (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm).
   */
  randomizePlayerRatingsOrder() {
    for (let i = this.playerRatings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerRatings[i], this.playerRatings[j]] = [
        this.playerRatings[j],
        this.playerRatings[i],
      ];
    }
  }

  /**
   * Sorts the PlayerRatings based on the players strength in descending order
   * Nothing is returned, the currently stored order is modified
   */
  sortPlayerRatingsByStrengthDesc() {
    this.playerRatings.sort((a, b) => b.player.winsAgainst(a.player));
  }

  /**
   * Sorts the PlayerRatings based on the players strength in ascending order
   * Nothing is returned, the currently stored order is modified
   */
  sortPlayerRatingsByStrengthAsc() {
    this.playerRatings.sort((a, b) => a.player.winsAgainst(b.player));
  }

  /**
   * Sorts the PlayerRatings based on the players current rating in descending order
   * Nothing is returned, the currently stored order is modified
   */
  sortPlayerRatingsByCurrentRatingDesc() {
    this.playerRatings.sort((a, b) => b.currentRating - a.currentRating);
  }

  /**
   * Sorts the PlayerRatings based on the players current rating in ascending order
   * Nothing is returned, the currently stored order is modified
   */
  sortPlayerRatingsByCurrentRatingAsc() {
    this.playerRatings.sort((a, b) => a.currentRating - b.currentRating);
  }
}
