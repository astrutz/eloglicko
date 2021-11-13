<template>
  <v-card elevation="2">
    <v-card-title>Spielkonfiguration</v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="pb-0">
          <v-radio-group class="mt-0" v-model="opponentCreation" mandatory>
            <p class="text-subtitle-1" >Zusammenstellung der Spiele</p>
            <v-radio
              v-for="matchMaker in matchMakers"
              :key="matchMaker"
              :label="matchMaker.label"
              :value="matchMaker.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="pb-0">
          <p class="text-subtitle-1" style="color: black">Häufigkeit der Spiele</p>
          <v-text-field
            v-model="matchCount"
            label="Anzahl der Spiele pro Spieler"
            type="number"
            :rules="matchCountRules"
          ></v-text-field>
          <v-checkbox v-model="doubleMatches" label="Spieler können mehrfach aufeinander treffen"></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn class="ml-3" color="primary">Spiele starten</v-btn>
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
      { label: "Möglichst starke Gegner", value: "evenOpponents" },
      { label: "Manuell", value: "manual" },
    ],
    matchCountRules: [(v) => v <= 0 || "Mindestanzahl: 1 Spiel"],
    matchCount: 0,
    doubleMatches: false
  }),
  methods: {},
};
</script>