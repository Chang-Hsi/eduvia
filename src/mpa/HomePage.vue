<!-- src/mpa/HomePage.vue -->
<template>
  <div class="min-h-svh flex flex-col">
    <DefaultHeader />
    <main class="flex-1">
      <HomeView />
    </main>
    <DefaultFooter />
  </div>
</template>

<script setup>
import DefaultHeader from "@/components/layouts/DefaultHeader.vue";
import DefaultFooter from "@/components/layouts/DefaultFooter.vue";
import HomeView from "@/views/Home.vue";
</script>
