import Match from './Match.js';

export default class MatchMaker {
  /**
   * @type {Match[]}
   */
  matches = [];

  /**
   * @type {Match[][]}
   */
  rounds = [[]];

  ranking;

  constructor(ranking) {
    this.ranking = ranking;
  }

  addMatch(...matches) {
    this.matches.push(...matches);
    this.rounds.slice(-1)[0].push(...matches);
  }

  closeRound() {
    this.rounds.push([]);
  }

  /**
   * Generates possible match pairing based on the current rating of the players
   * Expects playerRatings to be in the order of sortPlayerRatingsByCurrentRatingDesc().
   *
   * Will group Players like:
   * [[1, 2], [3, 4], [5, 6], ...]
   *
   * If the number of players is odd, the last player will not play
   * @returns {[[PlayerRating]]} A list of opponents
   */
  getCurrentRatingPairMatches() {
    const res = [];
    // the minus one is, so we don't get a single element if we have an odd number of players
    for (let i = 0; i < this.ranking.playerRatings.length - 1; i += 2) {
      res.push(
        new Match(
          this.ranking.playerRatings[i],
          this.ranking.playerRatings[i + 1]
        )
      );
    }

    return res;
  }

  /**
   * Creates a list of random matches
   * @returns {[[PlayerRating]]} A list of opponents
   */
  getRandomOpponentMatches() {
    const playerRatingsCopy = [...this.ranking.playerRatings];

    const res = [];
    for (let i = 0; i < this.ranking.playerRatings.length - 1; i += 2) {
      const opponents = [];
      for (let j = 0; j < 2; j++) {
        opponents.push(
          playerRatingsCopy.splice(
            Math.floor(Math.random() * playerRatingsCopy.length),
            1
          )
        );
      }
      res.push(new Match(...opponents));
    }
    return res;
  }
}
