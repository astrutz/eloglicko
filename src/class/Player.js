export default class Player {
  /**
   * @type {number} The players strength as an arbritary number (>strength => wins)
   */
  strength = 0;

  /**
   * @type {string} The color to use when representing this player (should be a valid CSS color)
   */
  color;
  /**
   * @type {string} The name of the player
   */
  name;

  /**
   * @param {Obeject} options
   * @param {number} options.strength
   * @param {string} options.color
   */
  constructor({ strength, color = "#000", name = "" }) {
    this.strength = strength;
    this.color = color;
    this.name = name;
  }

  /**
   * This determines if a player wins, losses or if it's a draw.
   *
   * This function uses 1, 0 and -1 to represent the result, so it can easily be used for sorting by strength
   * @param {Player} other
   * @returns {number} 1 if this player wins, 0 if it's a draw and -1 for a loss against player other.
   */
  winsAgainst(other) {
    if (!other || this.strength > other.strength) return 1;
    if (this.strength === other.strength) return 0;
    return -1;
  }
}
