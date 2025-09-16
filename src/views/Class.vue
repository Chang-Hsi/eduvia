<template>
  <div>
    <ClassBanner />

    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8">
          <ClassMain />
        </div>
        <div class="col-span-12 lg:col-span-4">
          <ClassSidebar />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ClassBanner from "../components/class/ClassBanner.vue";
import ClassMain from "../components/class/ClassMain.vue";
import ClassSidebar from "../components/class/ClassSidebar.vue";
</script>
