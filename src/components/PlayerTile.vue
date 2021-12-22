<template>
  <v-card min-height="100%" elevation="2">
    <v-card-title>Turnierteilnehmer</v-card-title>
    <v-card-text>
      <v-list-item
        class="pl-0"
        two-line
        v-for="player in players"
        :key="player.id"
      >
        <v-list-item-icon class="ma-0 pl-0">
          <v-col class="pb-0 d-flex justify-center">
            <v-btn
              icon
              :color="player.color"
              @click="
                players.find((p) => p.id === player.id).color = `#${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`
              "
              ><v-icon>mdi-chess-pawn</v-icon></v-btn
            >
          </v-col>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ player.name }}</v-list-item-title>
          <v-list-item-subtitle
            >Stärke: {{ player.strength }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-icon class="ma-0">
          <v-col class="pb-0 d-flex justify-center">
            <v-btn icon color="red" @click="removePlayer(player.id)"
              ><v-icon>mdi-account-minus</v-icon></v-btn
            >
          </v-col>
        </v-list-item-icon>
      </v-list-item>
      <v-divider />
      <h3 class="pt-4 pb-2">Teilnehmer hinzufügen</h3>
      <v-row align="center" justify="center">
        <v-col class="pb-0">
          <v-text-field v-model="playerNameInput" label="Name"></v-text-field>
        </v-col>
        <v-col class="pb-0">
          <v-text-field
            v-model="playerStrengthInput"
            label="Spielstärke"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col class="pb-0 d-flex justify-center" cols="1">
          <v-btn icon color="primary" @click="addPlayer()"
            ><v-icon>mdi-account-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Player from "../class/Player";

export default {
  name: "UserTile",
  data: () => ({
    playerNameInput: null,
    playerStrengthInput: null,
    players: [],
  }),
  methods: {
    addPlayer() {
      if (this.playerStrengthInput && this.playerNameInput) {
        const createdPlayer = new Player({
          strength: this.playerStrengthInput,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          name: this.playerNameInput,
          id: uuidv4(),
        });
        this.players.push(createdPlayer);
        this.playerNameInput = "";
        this.playerStrengthInput = "";
      }
    },
    removePlayer(id) {
      this.players = this.players.filter((player) => player.id !== id);
    },
  },
};
</script>