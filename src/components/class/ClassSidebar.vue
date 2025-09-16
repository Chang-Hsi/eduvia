<template>
  <div class="sticky top-24 space-y-4">
    <div class="rounded-xl bg-white shadow ring-1 ring-black/5 p-4">
      <div class="text-gray-900 text-xl font-bold">NT${{ price.toLocaleString() }}</div>
      <div class="mt-1 flex items-center gap-2 text-sm text-emerald-600">
        <i class="pi pi-badge"></i>
        <span>最優惠可到 NT${{ bestPrice.toLocaleString() }}</span>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <Button class="flex-1" label="立即購買" severity="primary" />
        <Button icon="pi pi-shopping-cart" outlined rounded />
      </div>
    </div>

    <div class="rounded-xl bg-white shadow ring-1 ring-black/5 p-4">
      <div class="text-gray-900 font-semibold leading-snug line-clamp-2">
        其他人也在學｜Python 入門 × 動畫程式入門
      </div>
      <div class="text-xs text-gray-500 mt-1">課程組合優惠 85 折</div>
      <div class="text-xs text-emerald-600 mt-1">2 堂課程</div>

      <div class="mt-3 space-y-2">
        <div class="flex items-center gap-3 rounded-xl shadow ring-1 ring-gray-200 p-2">
          <img
            class="w-20 h-14 rounded object-cover"
            src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=500&auto=format&fit=crop"
            alt="c1"
          />
          <div class="min-w-0">
            <div class="text-[13px] text-gray-900 line-clamp-2">
              動畫互動網頁程式入門 (HTML/CSS/JS)
            </div>
            <div class="mt-1 text-[11px] text-emerald-700 font-medium">課程</div>
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl ring-1 ring-gray-200 p-2">
          <img
            class="w-20 h-14 rounded object-cover"
            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=500&auto=format&fit=crop"
            alt="c2"
          />
          <div class="min-w-0">
            <div class="text-[13px] text-gray-900 line-clamp-2">
              Python 入門特訓－基礎實作到證照攻略
            </div>
            <div class="mt-1 text-[11px] text-emerald-700 font-medium">課程</div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-gray-400 line-through">
          NT${{ comboOrigin.toLocaleString() }}
        </div>
        <div class="text-rose-600 text-xl font-bold">
          NT${{ comboPrice.toLocaleString() }}
        </div>
        <div class="text-xs text-gray-500 mt-1">販售至 2025 年 12 月 31 日</div>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <Button class="flex-1" label="立即購買" severity="primary" />
        <Button icon="pi pi-shopping-cart" outlined rounded />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";

const props = defineProps({
  price: { type: Number, default: 1790 },
  bestPrice: { type: Number, default: 1680 },
  comboOrigin: { type: Number, default: 3790 },
  comboPrice: { type: Number, default: 3220 },
});
</script>
