<template>
  <v-app>
    <v-main>
      <!-- Maybe use container padding instead of fluid -->
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <PlayerTile/>
          </v-col>
          <v-col cols="8">
            <ConfigTile/>
            <GraphTile class="mt-6"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
          <DetailTile/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import PlayerTile from './components/PlayerTile.vue';
import ConfigTile from './components/ConfigTile.vue';
import GraphTile from './components/GraphTile.vue';
import DetailTile from './components/DetailTile.vue';

export default {
  name: 'App',

  components: {
    PlayerTile,
    ConfigTile,
    GraphTile,
    DetailTile,
  },

  data: () => ({
    //
  }),
};
</script>
