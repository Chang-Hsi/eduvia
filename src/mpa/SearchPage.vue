<!-- src/mpa/SearchPage.vue -->
<template>
  <div class="min-h-svh flex flex-col">
    <DefaultHeader />
    <main class="flex-1">
      <SearchView />
    </main>
    <DefaultFooter />
  </div>
</template>

<script setup>
// 不在 <template> 放註解（依你的偏好）
import DefaultHeader from "@/components/layouts/DefaultHeader.vue";
import DefaultFooter from "@/components/layouts/DefaultFooter.vue";
import SearchView from "@/views/Search.vue";
</script>
