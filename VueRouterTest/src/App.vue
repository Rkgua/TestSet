<template>
  <nav>
    <!-- <a href="/#/">主页</a>
    <a href="/#/chicken-egg">鸡蛋</a>   多次http请求-->
    <!-- <RouterLink to="/">主页</RouterLink>
    <RouterLink to="/chicken-egg">鸡蛋</RouterLink> -->
    <router-link to="/">主页</router-link>
    <router-link
      v-for="dataEgg in dataEggs"
      :key="dataEgg.id"
      :to="`/eggs/${dataEgg.type}`"
    >
      {{ dataEgg.name }}
    </router-link>
  </nav>
  <router-view></router-view>
</template>
<script>
import dataEggs from "./data.json";
export default {
  data() {
    return {
      dataEggs,
    };
  },
};
</script>
