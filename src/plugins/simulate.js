import MatchMaker from '../class/MatchMaker';
import Ranking from '../class/Ranking';
import store from './store';

export default () => {
  const ranking = getInitialRanking();
  const matchMaker = getMatchMaker(ranking);
  setPlayerRatings(matchMaker, ranking);
  store.commit('addTournament', matchMaker);
};

/**
 * Create a new ranking with all players
 * @returns {Ranking}
 */
function getInitialRanking() {
  const ranking = new Ranking();
  // TODO: If wanted, addPlayer() can take a player rating as second argument, otherwise defaultInitialRating from Ranking.js is used
  store.state.players.forEach((player) => ranking.addPlayer(player));
  return ranking;
}

/**
  * Create a new MatchMaker with matches
  * @param {MatchMaker} matchMaker 
  * @returns {MatchMaker}  
  */
function getMatchMaker(ranking) {
  const matchMaker = new MatchMaker(ranking);
  let matches;
  for (let i = 0; i < store.state.configuration.numberOfMatchesPerPlayer; i++) {
    switch (store.state.configuration.matchMaker) {
      case 'random': matches = matchMaker.getRandomOpponentMatches(); break;
      case 'seeding': matches = matchMaker.getSeedingMatches(); break; //FIXME
      case 'evenOpponents': matches = matchMaker.getRandomOpponentMatches(); break;
      // case 'manual': matches = matchMaker.getRandomOpponentMatches(); break; //TODO
    }
    matchMaker.addMatch(matches);
  }
  return matchMaker;
}

/**
  * Sets new ratings for each player
  * @param {MatchMaker} matchMaker 
  * @param {Ranking} ranking 
  */
function setPlayerRatings(matchMaker, ranking) {
  const isElo = store.state.configuration.ratingSystem === 'elo';
  matchMaker.matches.forEach((round) => {
    round.forEach((match) => {
      if(isElo) {
        if(match.winner) {
          match.winner.calculateEloScore(match.loser, 1);
          match.loser.calculateEloScore(match.winner, -1);
        } else {
          match.opponents[0].calculateEloScore(match.opponents[1], 0);
          match.opponents[1].calculateEloScore(match.opponents[0], 0);
        }
      } else {
        match.winner.calculateGlickoScore(match.loser, 1);
        match.loser.calculateGlickoScore(match.winner, -1);
      }    
    });
  });
  ranking.sortPlayerRatingsByCurrentRatingDesc();
}