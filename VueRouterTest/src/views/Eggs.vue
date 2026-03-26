<template>
  <h1>{{ dataEgg.name }}</h1>
  <p>{{ dataEgg.description }}</p>
  <p>{{ dataEgg.flavour }}</p>
  <img :src="`/src/assets/${dataEgg.image}`" alt="" />
</template>

<script>
import dataEggs from "../data.json";
export default {
  computed: {
    eggType() {
      return this.$route.params.type;
    },
    dataEgg() {
      return dataEggs.find((dataEgg) => dataEgg.type === this.eggType);
    },
  },
};
</script>
<style scoped>
img {
  width: 150px;
  height: 150px;
}
</style>
