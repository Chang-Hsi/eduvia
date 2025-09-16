<!-- src/layouts/DefaultFooter.vue -->
<template>
  <footer class="border-t border-gray-300 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div class="font-semibold mb-3">熱門主題</div>
          <ul class="space-y-2 text-gray-600">
            <li>
              <RouterLink to="/c/frontend" class="hover:text-gray-900"
                >前端開發</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/c/backend" class="hover:text-gray-900"
                >後端開發</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/c/uiux" class="hover:text-gray-900">UI/UX 設計</RouterLink>
            </li>
            <li>
              <RouterLink to="/c/data" class="hover:text-gray-900">資料分析</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <div class="font-semibold mb-3">eduvia</div>
          <ul class="space-y-2 text-gray-600">
            <li>
              <RouterLink to="/about" class="hover:text-gray-900">關於我們</RouterLink>
            </li>
            <li>
              <RouterLink to="/teach" class="hover:text-gray-900">成為講師</RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="hover:text-gray-900">聯絡我們</RouterLink>
            </li>
            <li>
              <RouterLink to="/help" class="hover:text-gray-900">幫助中心</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <div class="font-semibold mb-3">條款</div>
          <ul class="space-y-2 text-gray-600">
            <li>
              <RouterLink to="/terms" class="hover:text-gray-900">服務條款</RouterLink>
            </li>
            <li>
              <RouterLink to="/privacy" class="hover:text-gray-900"
                >隱私權政策</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/cookie" class="hover:text-gray-900">Cookie</RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-span-2 sm:col-span-3 md:col-span-1">
          <div class="font-semibold mb-3">追蹤我們</div>
          <div class="flex items-center gap-3 text-gray-600">
            <a href="#" class="hover:text-gray-900">Facebook</a>
            <a href="#" class="hover:text-gray-900">X</a>
            <a href="#" class="hover:text-gray-900">YouTube</a>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-between text-xs text-gray-500">
        <div class="font-extrabold text-gray-900">eduvia</div>
        <div>© {{ new Date().getFullYear() }} eduvia. All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer 目前為靜態連結，之後可抽成陣列或接 CMS
</script>
