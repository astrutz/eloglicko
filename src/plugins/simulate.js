/*
✅ Ranking mit Playern erstellen
✅ MatchMaker mit dem Ranking erstellen
✅ MatchMaker sagen, dass er Matches erstellen soll und diese Matches mit addMatch wieder hinzufügen
TODO: Updaten der Spielerratings (Elo/Glicko, noch nicht implementiert) - Kind von Ranking
*/

import MatchMaker from '../class/MatchMaker';
import Ranking from '../class/Ranking';
import store from './store';

export default () => {
  const ranking = getInitialRanking();
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
  store.commit('addTournament', matchMaker);
};

function getInitialRanking() {
  const ranking = new Ranking();
  // TODO: If wanted, addPlayer() can take a player rating as second argument, otherwise defaultInitialRating from Ranking.js is used
  store.state.players.forEach((player) => ranking.addPlayer(player));
  return ranking;
}