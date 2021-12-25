<template>
  <v-card v-if="currentTournament" elevation="2">
    <v-card-title>Rangliste</v-card-title>
    <v-card-text>
      <v-list-item
        class="pl-0"
        two-line
        v-for="(playerRating, index) in currentTournament.ranking.playerRatings"
        :key="playerRating.player.id"
      >
        <v-list-item-content>
          <v-list-item-title
            >{{ index + 1 }}. {{ playerRating.player.name }}</v-list-item-title
          >
          <v-list-item-subtitle
            >Rating: {{ playerRating.currentRating }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon class="ma-0 pl-0">
          <v-col class="pb-0 d-flex justify-center">
            <v-icon :color="playerRating.player.color">mdi-chess-pawn</v-icon>
          </v-col>
        </v-list-item-icon>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "RankingTile",
  data: () => ({}),
  computed: {
    currentTournament() {
      return this.$store.state.currentTournament;
    },
    players() {
      return this.$store.state.players;
    },
  },
};
</script>