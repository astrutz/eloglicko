/**
 * @typedef {import('./Player.js').default} Player
 */

export default class PlayerRating {
  /**
   * @type {number}
   */
  ELO_KENNETH_HARKNESS_MAGIC = 400;
  ELO_MAX_POSSIBLE_POINTSWITCH = 40;
  ELO_INITIAL_RATING = 100;
  GLICKO_RATING_DEVIATION = 350;
  GLICKO_INITIAL_RATING = 1500;

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

  /**
   * Calculates the elo score after a match
   * @param {PlayerRating} opponent 
   * @param {Boolean} hasWon 
   */
  calculateEloScore(opponent, hasWon) {
    if (this.ratings.length === 1) {
      this.currentRating = this.ELO_INITIAL_RATING;
    }
    const expectationValue = parseFloat((1 / (1 + Math.pow(10, ((this.currentRating - opponent.currentRating) / this.ELO_KENNETH_HARKNESS_MAGIC)))).toFixed(3));
    if (hasWon) {
      this.currentRating = this.currentRating + this.ELO_MAX_POSSIBLE_POINTSWITCH * (1 - expectationValue).toFixed(1);
    } else {
      this.currentRating = this.currentRating + this.ELO_MAX_POSSIBLE_POINTSWITCH * (0 - expectationValue).toFixed(1);
    }
    // TODO: Unentschieden
  }

  /**
   * Calculates the glicko score after a match
   * @param {PlayerRating} opponent 
   * @param {Boolean} hasWon 
   */
  calculateGlickoScore() {
    if (this.ratings.length === 1) {
      this.currentRating = this.GLICKO_INITIAL_RATING;
    }
    // TODO: Use a good c
    // const c = 34.64;
    // const ratingDeviation = Math.min(Math.sqrt(Math.pow(this.currentRating, this.currentRating) + Math.pow(c, c)), this.GLICKO_RATING_DEVIATION);
    // TODO: What's next

    // TODO: Unentschieden
  }

}
