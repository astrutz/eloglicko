import Match from './Match.js';
import store from '../plugins/store';

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
   * If the number of players is odd a random player will not play ("spielfrei")
   * @returns {[[PlayerRating]]} A list of opponents
   */
  getCurrentRatingPairMatches() {
    this.ranking.sortPlayerRatingsByCurrentRatingDesc();
    const playerRatingsCopy = [...this.ranking.playerRatings];
    const res = [];
    let freilosPlayerRating;

    // Give a random player "spielfrei"
    if (playerRatingsCopy.length % 2 !== 0) {
      freilosPlayerRating = playerRatingsCopy.splice(Math.floor(Math.random() * playerRatingsCopy.length), 1);
    }

    // the minus one is, so we don't get a single element if we have an odd number of players
    for (let i = 0; i < playerRatingsCopy.length; i += 2) {
      res.push(
        new Match(
          playerRatingsCopy[i],
          playerRatingsCopy[i + 1],
          store.state.configuration.useRandom
        )
      );
    }
    if (freilosPlayerRating) {
      res.push(new Match(...[freilosPlayerRating[0], null]));
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
      let opponents = [];
      for (let j = 0; j < 2; j++) {
        opponents = opponents.concat(
          playerRatingsCopy.splice(
            Math.floor(Math.random() * playerRatingsCopy.length),
            1
          )
        );
      }
      res.push(new Match(...opponents, store.state.configuration.useRandom));
    }
    playerRatingsCopy.forEach((rating) => {
      res.push(new Match(...[rating, null]));
    });
    return res;
  }

  /**
   * Generates possible match pairing based on the current rating of the players as seeding
   * Expects playerRatings to be in the order of sortPlayerRatingsByCurrentRatingDesc().
   *
   * Will group n Players like:
   * [[1, n], [2, n - 1], [3, n - 2], ...]
   * 
   * For 8 players it will be:
   * [[1, 8], [2, 7], [3, 6], [4, 5]]
   *
   * If the number of players is odd a random player will not play ("spielfrei")
   * @returns {[[PlayerRating]]} A list of opponents
   */
  getSeedingMatches() {
    this.ranking.sortPlayerRatingsByCurrentRatingDesc();
    const playerRatingsCopy = [...this.ranking.playerRatings];
    const res = [];
    let freilosPlayerRating;


    // Give a random player "spielfrei"
    if (playerRatingsCopy.length % 2 !== 0) {
      freilosPlayerRating = playerRatingsCopy.splice(Math.floor(Math.random() * playerRatingsCopy.length), 1);
    }

    for (let i = 0; i < playerRatingsCopy.length / 2; i++) {
      res.push(
        new Match(
          playerRatingsCopy[i],
          playerRatingsCopy[playerRatingsCopy.length - i - 1],
          store.state.configuration.useRandom
        )
      );
    }
    if (freilosPlayerRating) {
      res.push(new Match(...[freilosPlayerRating[0], null]));
    }
    return res;
  }
}
