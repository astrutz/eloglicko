<template>
  <v-card v-if="currentTournament" elevation="2">
    <v-card-title>Ergebnisse</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="4"
          v-for="(round, index) in currentTournament.matches"
          :key="index"
        >
          <v-card elevation="2">
            <v-card-title>Runde {{ index + 1 }}</v-card-title>
            <v-card-text>
              <p v-for="match in round" :key="match.id">
                <span
                  v-if="match.winner"
                  :class="
                    isUpset(match.winner, match.loser, index) ? 'upset' : ''
                  "
                >
                  {{ getDisplayName(match.winner, index) }} gewinnt gegen
                  {{ getDisplayName(match.loser, index) }}
                </span>
                <span v-else-if="match.loser === -1">
                  {{ getDisplayName(match.opponents[0], index) }} hat spielfrei
                </span>
                <span v-else>
                  {{ getDisplayName(match.opponents[0], index) }} spielt remis
                  gegen
                  {{ getDisplayName(match.opponents[1], index) }}
                </span>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DetailTile",
  data: () => ({}),
  computed: {
    currentTournament() {
      return this.$store.state.currentTournament;
    },
  },
  methods: {
    getDisplayName(playerRating) {
      // playerRating.ratings[roundNumber + 1]
      return `${playerRating.player.name} (${playerRating.player.strength})`;
    },
    isUpset(winnerPlayerRating, loserPlayerRating) {
      return (
        winnerPlayerRating.player.strength < loserPlayerRating.player.strength
      );
    },
  },
};
</script>

<style scoped>
.upset {
  color: red;
}
</style>