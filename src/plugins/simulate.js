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
  switch (store.state.configuration.ratingSystem) {
    case "elo":
      setPlayerRatingsElo(matches);
      break;
    case "glicko":
      setPlayerRatingsGlicko(matches, ranking);
      break;
    default:
      console.error("Invalid Rating System");
  }
  ranking.sortPlayerRatingsByCurrentRatingDesc();
}

/**
 * Sets new ratings for each player for a round
 * @param {[Match]} matches
 */
function setPlayerRatingsElo(matches) {
  matches.forEach((match) => {
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
  });
}

/**
 * Sets new ratings for each player for a round
 * @param {[Match]} matches
 * @param {Ranking} ranking
 */
function setPlayerRatingsGlicko(matches, ranking) {
  matches = matches.filter((match) => match.opponents[1]);
  // collect playerInfos with win/loose info
  const matchResultsByPlayer = new Map();

  for (const match of matches) {
    if (!matchResultsByPlayer.has(match.winner)) {
      matchResultsByPlayer.set(match.winner, []);
    }
    if (!matchResultsByPlayer.has(match.loser)) {
      matchResultsByPlayer.set(match.loser, []);
    }
    matchResultsByPlayer
      .get(match.winner)
      .push({ opponent: match.loser, result: 1 });
    matchResultsByPlayer
      .get(match.loser)
      .push({ opponent: match.winner, result: 1 });
  }

  // Update player Rating and RD
  // We need to do it in two loops, since we first need to calc all new values without changing the old ones
  const newRatings = new Map();
  for (const [player, matchResults] of matchResultsByPlayer.entries()) {
    newRatings.set(player, {
      rating: player.calculateGlickoScore(matchResults),
      rd: player.glickoNewPlayerRD(matchResults),
    });
  }
  for (const [player, newRatings] of newRatings) {
    player.currentRating = newRatings.rating;
    player.currentGlickoRD = newRatings.rd;
    player.glickoTimeSinceLastGame = 0;
  }

  // Update all players glickoTimeSinceLastGame+=1
  ranking.playerRatings.forEach(
    (playerRating) => {
      playerRating.glickoTimeSinceLastGame++;
      // this player hat a free pass this round, so his ratings were duplicated
      if (!newRatings.has(playerRating)) {
        // eslint-disable-next-line no-self-assign
        playerRating.currentRating = playerRating.currentRating;
      }
    }
  );
}
