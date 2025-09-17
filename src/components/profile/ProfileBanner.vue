<template>
  <div class="w-full h-[15vh] flex justify-center items-center" :style="bannerBgStyle">
    <span class="text-5xl text-black/90 font-extrabold">我的個人檔案</span>
  </div>
</template>

<script setup>
import searchBg from "@/assets/imgs/Search_bg.jpg";

const bannerBgStyle = {
  backgroundImage: `url(${searchBg})`,
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
  backgroundPosition: "top center",
};
</script>

<style lang="scss" scoped></style>
