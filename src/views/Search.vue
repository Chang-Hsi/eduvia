<!-- src/views/Search.vue -->
<template>
  <div>
    <SearchBanner v-if="showBanner" />
    <SearchList />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SearchBanner from "../components/search/SearchBanner.vue";
import SearchList from "../components/search/SearchList.vue";

const route = useRoute();
const q = computed(() => {
  const v = route.query.q;
  return Array.isArray(v) ? v[0] : v ?? "";
});
const showBanner = computed(() => q.value === "所有課程");
</script>
