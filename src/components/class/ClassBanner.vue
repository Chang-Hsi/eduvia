<!-- src/components/class/ClassBanner.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <div class="grid grid-cols-12 gap-6 items-start">
      <div class="col-span-12 lg:col-span-7">
        <div class="rounded-xl overflow-hidden ring-1 ring-black/5 shadow">
          <div class="relative w-full" style="padding-top: 56.25%">
            <iframe
              class="absolute inset-0 w-full h-full"
              :src="embedSrc"
              title="course preview"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 pt-8">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-book text-emerald-600"></i>
          <span class="text-sm text-gray-500">{{ organization }}</span>
        </div>

        <h1 class="text-2xl md:text-3xl font-extrabold leading-tight text-gray-900">
          {{ title }}
        </h1>

        <p class="mt-3 text-gray-600 leading-7">
          {{ summary }}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <Tag value="熱門課程" severity="danger" rounded />
          <Tag :value="discountLabel" rounded />
          <Tag v-if="hasPlaylist" value="含播放清單" rounded />
        </div>

        <div class="mt-4 flex items-center gap-2">
          <span class="text-amber-500 text-lg font-semibold">{{
            rating.toFixed(1)
          }}</span>
          <Rating
            :modelValue="Math.round(rating)"
            :cancel="false"
            readonly
            :pt="ratingPt"
          />
          <span class="text-sm text-gray-500">({{ ratingCount.toLocaleString() }})</span>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <Button label="收藏課程" icon="pi pi-bookmark" outlined />
          <Button label="贈送這門課" icon="pi pi-gift" severity="secondary" outlined />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/* 說明：
   - 傳入 videoUrl（YouTube 連結），自動轉成嵌入用的 embed URL。
   - 其它文字資訊可由 props 覆寫；若不傳則使用預設值。
*/
import { computed } from "vue";
import Button from "primevue/button";
import Rating from "primevue/rating";
import Tag from "primevue/tag";

const props = defineProps({
  videoUrl: {
    type: String,
    default:
      "https://www.youtube.com/watch?v=wqRlKVRUV_k&list=PL-g0fdC5RMboYEyt6QS2iLb_1m7QcgfHk",
  },
  organization: { type: String, default: "電腦技能基金會" },
  title: {
    type: String,
    default: "Python 入門特訓 – 基礎實作到證照攻略",
  },
  summary: {
    type: String,
    default:
      "Python 證照攻略課程，教你 Python 的程式語法與開發觀念；同時帶你 TQC 甲 Python 認證考試的攻略要點，快速掌握考照關鍵。",
  },
  discountLabel: { type: String, default: "評價優於前 10% 課程" },
  rating: { type: Number, default: 5.0 },
  ratingCount: { type: Number, default: 617 },
});

const embedSrc = computed(() => {
  try {
    const u = new URL(props.videoUrl);
    const v = u.searchParams.get("v");
    const list = u.searchParams.get("list");
    const base = `https://www.youtube.com/embed/${v ?? ""}`;
    const qs = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      controls: "1",
      iv_load_policy: "3",
      color: "white",
    });
    if (list) qs.set("list", list);
    return `${base}?${qs.toString()}`;
  } catch {
    return props.videoUrl;
  }
});
const hasPlaylist = computed(() => {
  try {
    const u = new URL(props.videoUrl);
    return !!u.searchParams.get("list");
  } catch {
    return false;
  }
});

const ratingPt = {
  onIcon: { class: "pi pi-star-fill text-amber-400 text-base" },
  offIcon: { class: "pi pi-star text-amber-300 text-base" },
};
</script>

<style scoped>
:deep(.p-rating) {
  vertical-align: middle;
}
</style>
