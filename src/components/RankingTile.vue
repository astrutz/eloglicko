<template>
  <v-card v-if="currentTournament" elevation="2">
    <v-card-title>Rangliste</v-card-title>
    <v-card-text>
      <!-- TODO: Use the elo or glicko rating when available -->
      <v-list-item
        class="pl-0"
        two-line
        v-for="(player, index) in players"
        :key="player.id"
      >
        <v-list-item-content>
          <v-list-item-title
            >{{ index + 1 }}. {{ player.name }}</v-list-item-title
          >
          <v-list-item-subtitle
            >Stärke: {{ player.strength }}</v-list-item-subtitle
          >
        </v-list-item-content>
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