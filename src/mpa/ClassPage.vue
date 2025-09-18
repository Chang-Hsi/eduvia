<!-- src/mpa/ClassPage.vue -->
<template>
  <div class="min-h-svh flex flex-col">
    <DefaultHeader />
    <main class="flex-1">
      <ClassView />
    </main>
    <DefaultFooter />
  </div>
</template>

<script setup>
// 不在 <template> 放註解（依你的偏好）
// 這裡直接複用你既有的組件
import DefaultHeader from "@/components/layouts/DefaultHeader.vue";
import DefaultFooter from "@/components/layouts/DefaultFooter.vue";
import ClassView from "@/views/Class.vue";
</script>
