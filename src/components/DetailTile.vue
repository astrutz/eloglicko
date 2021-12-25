<template>
  <v-card v-if="currentTournament" elevation="2">
    <v-card-title>Ergebnisse</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="3"
          v-for="(round, index) in currentTournament.matches"
          :key="index"
        >
          <v-card elevation="2">
            <v-card-title>Runde {{ index + 1 }}</v-card-title>
            <v-card-text>
              <p v-for="match in round" :key="match.id">
                <span v-if="match.winner">
                  {{ match.winner.player.name }} gewinnt gegen
                  {{ match.loser.player.name }}
                </span>
                <span v-else>
                  {{ match.opponents[0].player.name }} spielt remis
                  gegen {{ match.opponents[1].player.name }}
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
};
</script>