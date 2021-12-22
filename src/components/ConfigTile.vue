<template>
  <v-card elevation="2">
    <v-card-title>Spielkonfiguration</v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="pb-0">
          <v-radio-group class="mt-0" v-model="chosenMatchMaker" mandatory>
            <p class="text-subtitle-1">Zusammenstellung der Spiele</p>
            <v-radio
              v-for="matchMaker in matchMakers"
              :key="matchMaker.value"
              :label="matchMaker.label"
              :value="matchMaker.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="pb-0">
          <v-radio-group class="mt-0" v-model="chosenRatingSystem" mandatory>
            <p class="text-subtitle-1">Bewertung der Spiele</p>
            <v-radio
              v-for="ratingSystem in ratingSystems"
              :key="ratingSystem.value"
              :label="ratingSystem.label"
              :value="ratingSystem.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="pb-0">
          <p class="text-subtitle-1" style="color: black">
            Häufigkeit der Spiele
          </p>
          <v-text-field
            v-model="numberOfMatchesPerPlayer"
            label="Anzahl der Spiele pro Spieler"
            type="number"
            :rules="numberOfMatchesPerPlayerRules"
          ></v-text-field>
          <v-checkbox
            v-model="multipleMatches"
            label="Spieler können mehrfach aufeinander treffen"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="startSimulation()" class="ml-3" color="primary"
        >Spiele starten</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ConfigTile",
  data: () => ({
    chosenMatchMaker: null,
    matchMakers: [
      { label: "Zufällig", value: "random" },
      { label: "Setzliste", value: "seeding" },
      { label: "Möglichst gleich starke Gegner", value: "evenOpponents" },
      { label: "Manuell", value: "manual" },
    ],
    chosenRatingSystem: null,
    ratingSystems: [
      { label: "Elo-Rating", value: "elo" },
      { label: "Glicko-Rating", value: "glicko" },
    ],
    numberOfMatchesPerPlayerRules: [(v) => v > 0 || "Mindestanzahl: 1 Spiel"],
    numberOfMatchesPerPlayer: 0,
    multipleMatches: false,
  }),
  methods: {
    startSimulation() {
      const configuration = {
        matchMaker: this.chosenMatchMaker,
        ratingSystem: this.chosenRatingSystem,
        numberOfMatchesPerPlayer: parseInt(this.numberOfMatchesPerPlayer),
        multipleMatches: this.multipleMatches
      };
      this.$store.commit('setConfiguration', configuration)
    },
  },
};
</script>