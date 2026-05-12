<template>
  <h1>{{ dataEgg.name }}</h1>
  <p>{{ dataEgg.description }}</p>
  <p>{{ dataEgg.flavour }}</p>
  <img :src="`/src/assets/${dataEgg.image}`" alt="" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router"; // Vue 3 中通过 Hook 获取路由
import dataEggs from "../data.json";

const route = useRoute();

// 获取路由参数
const eggType = computed(() => route.params.type);
const dataEgg = computed(() =>
  dataEggs.find((item) => item.type === eggType.value),
);
</script>

<style scoped>
img {
  width: 150px;
  height: 150px;
}
</style>
