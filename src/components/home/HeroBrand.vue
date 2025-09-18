<!-- src/components/HeroBrand.vue -->
<template>
  <section class="theme-fixed-light py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- 標題 -->
      <h3 class="text-center text-gray-500 text-sm md:text-base">
        與我們有進行合作或正在合作中的聯名大學
      </h3>

      <!-- Logo 列：手機可橫向滑動；桌面等距排列 -->
      <div class="mt-6 overflow-x-auto md:overflow-visible no-scrollbar">
        <ul
          class="min-w-max md:min-w-0 flex flex-nowrap md:flex-wrap items-center justify-start gap-10 md:gap-14"
          aria-label="trusted-by-logos"
        >
          <!-- 直接換成你的實際圖檔路徑即可 -->
          <li class="shrink-0">
            <img src="../../assets/imgs/JCU.png" alt="Volkswagen" class="w-32" />
          </li>
          <li class="shrink-0">
            <img src="../../assets/imgs/NCU.png" alt="Samsung" class="w-32" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
// 不需要任何資料或 props，純畫面
</script>
