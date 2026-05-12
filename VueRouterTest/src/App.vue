<template>
  <nav>
    <router-link to="/">主页</router-link>
    <router-link
      v-for="dataEgg in dataJson"
      :key="dataEgg.id"
      :to="`/eggs/${dataEgg.type}`"
    >
      {{ dataEgg.name }}
    </router-link>
  </nav>
  <router-view></router-view>
</template>
<script setup>
import dataEggs from "./data.json";
import { reactive } from "vue";
const dataJson = reactive(dataEggs);
</script>
