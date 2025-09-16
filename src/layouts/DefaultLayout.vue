<template>
  <div class="min-h-svh flex flex-col">
    <!-- Header -->
    <DefaultHeader />

    <!-- 內容區 -->
    <main class="flex-1">
      <!-- 中間主內容：由子路由渲染 -->
      <RouterView />
    </main>

    <!-- Footer -->
    <DefaultFooter />
  </div>
</template>
<script setup>
import DefaultHeader from "@/components/layouts/DefaultHeader.vue";
import DefaultFooter from "@/components/layouts/DefaultFooter.vue";
</script>
