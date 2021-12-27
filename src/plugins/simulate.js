import MatchMaker from '../class/MatchMaker';
import Ranking from '../class/Ranking';
import store from './store';

export default () => {
  const ranking = getInitialRanking();
  const matchMaker = new MatchMaker(ranking);
  for (let i = 0; i < store.state.configuration.numberOfMatchesPerPlayer; i++) {
    const matches = getMatches(matchMaker);
    matchMaker.addMatch(matches);
    setPlayerRatings(matches, ranking);
  }
  store.commit('addTournament', matchMaker);
};

/**
 * Create a new ranking with all players
 * @returns {Ranking}
 */
function getInitialRanking() {
  const ranking = new Ranking();
  store.state.players.forEach((player) => ranking.addPlayer(player));
  return ranking;
}

/**
  * Create a round of matches
  * @param {MatchMaker} matchMaker 
  * @returns {[Match]}  
  */
function getMatches(matchMaker) {
  let matches;
  switch (store.state.configuration.matchMaker) {
    case 'random': matches = matchMaker.getRandomOpponentMatches(); break;
    case 'seeding': matches = matchMaker.getSeedingMatches(); break;  // FIXME
    case 'evenOpponents': matches = matchMaker.getCurrentRatingPairMatches(); break;
  }
  return matches;
}

/**
  * Sets new ratings for each player for a round
  * @param {[Match]} matches 
  * @param {Ranking} ranking 
  */
function setPlayerRatings(matches, ranking) {
  const isElo = store.state.configuration.ratingSystem === 'elo';
  // TODO: Initiate and set glicko RDs for all players
  matches.forEach((match) => {
    if (isElo) {
      if (match.winner) {
        // Sieg/Niederlage
        match.winner.calculateEloScore(match.loser, 1);
        match.loser.calculateEloScore(match.winner, -1);
      } else if (match.opponents[1]) {
        // Unentschieden
        match.opponents[0].calculateEloScore(match.opponents[1], 0);
        match.opponents[1].calculateEloScore(match.opponents[0], 0);
      } else {
        // Spielfrei
        // Spielfrei am ersten Spieltag
        if (match.opponents[0].ratings.length === 1) {
          match.opponents[0].ratings.push(100);
          match.opponents[0].ratings.push(100);
        } else {
          // eslint-disable-next-line no-self-assign
          match.opponents[0].currentRating = match.opponents[0].currentRating;
        }
      }
    } else {
      match.winner.calculateGlickoScore(match.loser, 1);
      match.loser.calculateGlickoScore(match.winner, -1);
    }
  });
  ranking.sortPlayerRatingsByCurrentRatingDesc();
}