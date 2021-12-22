import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    players: []
  },
  mutations: {
    addPlayer(state, player) {
      state.players.push(player);
    },
    removePlayer(state, playerID) {
      state.players = state.players.filter((player) => player.id !== playerID);
    },
    changePlayerColor(state, playerID) {
      state.players.find((p) => p.id === playerID).color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
  }
})