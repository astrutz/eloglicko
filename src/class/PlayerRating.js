/**
 * @typedef {import('./Player.js').default} Player
 */

export default class PlayerRating {
  /**
   * @type {[number]}
   */
  ratings = [];

  /**
   * @type {Player}
   */
  player;

  /**
   * @param {Player} player The player this rating is for
   * @param {number} initialRating the initial rating of this player
   */
  constructor(player, initialRating = 0) {
    this.player = player;
    this.currentRating = initialRating;
  }

  /**
   * Sets the current rating for a player and automatically pushes that value to the ratings history
   * @param {number} value new rating
   */
  set currentRating(value) {
    this.ratings.push(value);
  }

  /**
   * Returns the current rating of the player by using the last entry in the ratings history
   * @returns {number} Last Rating
   */
  get currentRating() {
    return this.ratings.slice(-1)[0];
  }

  /**
   * Get the average rating for this palyer
   * @returns {number} the total average rating
   */
  get averageRating() {
    return this.getRollingAverageRating(this.ratings.length);
  }

  /**
   * Calculates the rolling average for the rating
   * @param {number} sampleCount Number of samples to include in the rolling average
   * @returns {number} The rolling average
   */
  getRollingAverageRating(sampleCount = 10) {
    const samples = this.ratings.slice(-sampleCount);
    return samples.reduce((acc, cur) => acc + cur, 0) / samples.length;
  }
}
