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
  GLICKO_MAX_RATING_DEVIATION = 350;
  GLICKO_INITIAL_RATING = 1500;
  GLICKO_C = 34.64;

  GLICKO_DEFAULT_C = 20 * Math.sqrt(10);
  GLICKO_Q = Math.log(10) / 400;
  GLICKO_INITIAL_RD = this.GLICKO_MAX_RATING_DEVIATION;

  /**
   * @type {number[]}
   */
  ratings = [];

  /**
   * @type {Player}
   */
  player;

  /**
   * @type {number[]}
   */
  glickoRDs = [];

  /**
   * @type {number[]}
   */
  glickoTimeSinceLastGame = 1;

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
   * Gets the ratings as a suitable array for d3.js
   * @returns {[Object]}
   */
  getGraphRating() {
    const ratings = this.ratings.map((rating, i) => ({
      name: this.player.name,
      color: this.player.color,
      rating,
      round: i - 1,
    }));
    ratings.shift();
    return ratings;
  }

  /**
   * Calculates the elo score after a match
   * @param {PlayerRating} opponent
   * @param {Number} result Is 1 if player has won, 0 if remis and -1 if player has lost
   */
  calculateEloScore(opponent, result) {
    if (this.ratings.length === 1) {
      this.currentRating = this.ELO_INITIAL_RATING;
    }
    const expectationValue = parseFloat(
      (
        1 /
        (1 +
          Math.pow(
            10,
            (this.currentRating - opponent.currentRating) /
              this.ELO_KENNETH_HARKNESS_MAGIC
          ))
      ).toFixed(3)
    );
    if (result === 1) {
      this.currentRating =
        this.currentRating +
        this.ELO_MAX_POSSIBLE_POINTSWITCH * (1 - expectationValue).toFixed(1);
    } else if (result === -1) {
      this.currentRating =
        this.currentRating +
        this.ELO_MAX_POSSIBLE_POINTSWITCH * (0 - expectationValue).toFixed(1);
    } else if (result === 0) {
      this.currentRating =
        this.currentRating +
        this.ELO_MAX_POSSIBLE_POINTSWITCH * (0.5 - expectationValue).toFixed(1);
    }
  }

  /**
   * Calculates the glicko score after a match
   * @param {{opponent: PlayerRating, result: 0|0.5|1}[]} matchResults
   * @returns {number} New Rating after round
   */
  calculateGlickoScore(matchResults) {
    let ratingChange = 0;
    for (const matchResult of matchResults) {
      const opponent = matchResult.opponent;
      ratingChange +=
        this.glickoG(opponent.glickoRoundRD) *
        (matchResult.result -
          this.glickoE(
            opponent.glickoRoundRD,
            this.currentRating - opponent.currentRating
          ));
    }

    let newRating =
      this.currentRating +
      (this.GLICKO_Q /
        (1 / this.glickoRoundRD ** 2 + 1 / this.glickoD2(matchResults))) *
        ratingChange;

    return Math.round(newRating);
  }

  /**
   * Calculate the new player RD for the next Round
   * @param {{opponent: PlayerRating, result: 0|0.5|1}[]} matchResults
   * @returns {number} New RD
   */
  glickoNewPlayerRD(matchResults) {
    return Math.round(
      Math.sqrt(
        1 / (1 / this.glickoRoundRD ** 2 + 1 / this.glickoD2(matchResults))
      )
    );
  }

  /**
   * Sets the current glickoRD for a player and automatically pushes that value to the glickRDs history
   * @param {number} value new glickoRD
   */
  set currentGlickoRD(value) {
    this.glickoRDs.push(value);
  }

  /**
   * Returns the current GlickoRD of the player by using the last entry in the GlickoRDs history
   * @returns {number} Last GlickoRD
   */
  get currentGlickoRD() {
    return this.glickoRDs.slice(-1)[0] || this.GLICKO_INITIAL_RD;
  }

  /**
   * Calculates a round rating deviation for calculations of the new rating
   * @param {number} currentRD current rating deviation of the player
   * @param {number} t rounds since last match
   * @param {number} [c] constant for scaling
   * @returns {number} Round RD
   */
  get glickoRoundRD() {
    return Math.min(
      Math.sqrt(
        this.currentGlickoRD ** 2 +
          this.GLICKO_DEFAULT_C ** 2 * this.glickoTimeSinceLastGame
      ),
      350
    );
  }

  /**
   * Calculates the d**2 for use in the glicko calcs
   * @param {number} currentPlayerIndex Index of the current player in the playerInfos
   * @param {{opponent: PlayerRating}[]} matchResults Rating and rating deviation of all players
   * @returns {number} d**2
   */
  glickoD2(matchResults) {
    // d2 is d**2
    let d2 = 0;
    for (const match of matchResults) {
      const opponent = match.opponent;
      const E = this.glickoE(
        opponent.glickoRoundRD,
        this.currentRating - opponent.currentRating
      );
      d2 +=
        1 /
        (this.GLICKO_Q ** 2 *
          (this.glickoG(opponent.glickoRoundRD) ** 2 * E * (1 - E)));
    }
    return d2;
  }

  /**
   * Calculates glickos g(RD)
   * @param {number} rd RD
   * @returns {number} g
   */
  glickoG(rd) {
    return 1 / Math.sqrt(1 + (3 * this.GLICKO_Q ** 2 * rd ** 2) / Math.PI ** 2);
  }

  /**
   * Calculates win probability for glicko calcs
   * @param {number} rd RD
   * @param {number} deltaR difference in rating between opponents
   * @returns {number} E
   */
  glickoE(rd, deltaR) {
    return 1 / (1 + 10 ** (-(this.glickoG(rd) * deltaR) / 400));
  }
}
