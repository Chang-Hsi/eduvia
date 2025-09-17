<!-- src/components/profile/tabs/SettingsTab.vue -->
<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-gray-100 rounded-2xl">
    <div class="grid grid-cols-12 gap-6">
      <!-- 左邊 20%：側欄 -->
      <aside class="col-span-12 md:col-span-3 lg:col-span-2">
        <nav class="sticky top-24 md:top-28">
          <ul class="space-y-2">
            <li v-for="s in sections" :key="s.key">
              <button
                class="w-full text-left px-3 py-2 rounded-md transition-colors"
                :class="
                  activeKey === s.key
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                "
                @click="goTo(s.key)"
              >
                {{ s.label }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 內容卡片 -->
      <main class="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
        <!-- 基本資料 -->
        <Card
          :pt="cardPt"
          class="scroll-mt-24 md:scroll-mt-28 rounded-xl ring-1 ring-black/5 overflow-hidden"
          :id="'basic'"
        >
          <template #header>
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
            >
              <h3 class="text-lg font-semibold text-gray-900">基本資料</h3>
              <button
                v-if="!editingBasic"
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-50"
                @click="onEditBasic()"
              >
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </template>

          <template #content>
            <div v-if="!editingBasic" class="p-5">
              <div class="flex flex-col sm:flex-row gap-4">
                <img
                  :src="profile.avatar"
                  alt="avatar"
                  class="w-20 h-20 rounded-lg object-cover ring-1 ring-black/5"
                />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 flex-1">
                  <div>
                    <div class="text-lg text-gray-500">姓名</div>
                    <div class="mt-0.5 font-medium text-gray-900">{{ profile.name }}</div>
                  </div>
                  <div>
                    <div class="text-lg text-gray-500">生日</div>
                    <div class="mt-0.5 text-gray-900">{{ profile.birthday }}</div>
                  </div>
                  <div>
                    <div class="text-lg text-gray-500">性別</div>
                    <div class="mt-0.5 text-gray-900">{{ profile.gender }}</div>
                  </div>
                  <div>
                    <div class="text-lg text-gray-500">聯絡電話</div>
                    <div class="mt-0.5 text-gray-900">{{ profile.phone }}</div>
                  </div>
                  <div class="sm:col-span-2">
                    <div class="text-lg text-gray-500">通知信箱</div>
                    <div class="mt-0.5 text-gray-900 break-all">{{ profile.email }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-5">
              <div class="flex flex-col sm:flex-row gap-6">
                <div class="relative w-20 h-20 shrink-0">
                  <img
                    :src="form.avatar || profile.avatar"
                    class="w-20 h-20 rounded-lg object-cover ring-1 ring-black/5"
                  />
                  <button
                    class="absolute -right-2 -bottom-2 w-9 h-9 rounded-full bg-rose-500 text-white shadow ring-1 ring-black/5 hover:bg-rose-600"
                    @click="removeAvatar()"
                    type="button"
                    aria-label="remove avatar"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 flex-1">
                  <label class="block">
                    <div
                      class="mb-1 text-sm font-medium after:content-['*'] after:text-rose-500"
                    >
                      姓名
                    </div>
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="w-full h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="請輸入姓名"
                    />
                  </label>

                  <label class="block">
                    <div class="mb-1 text-sm font-medium">生日</div>
                    <DatePicker
                      v-model="form.birthdayObj"
                      showIcon
                      iconDisplay="input"
                      dateFormat="yy/mm/dd"
                      inputId="birthday"
                      class="w-full"
                      :pt="{
                        input: {
                          class:
                            'w-full h-10 rounded-md border border-gray-300 px-3 text-gray-900',
                        },
                      }"
                    />
                  </label>

                  <div class="sm:col-span-2">
                    <div class="mb-1 text-sm font-medium">性別</div>
                    <div class="flex items-center gap-6">
                      <label class="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          value="男"
                          v-model="form.gender"
                          class="accent-emerald-600"
                        />
                        男
                      </label>
                      <label class="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          value="女"
                          v-model="form.gender"
                          class="accent-emerald-600"
                        />
                        女
                      </label>
                      <label class="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          value="其它"
                          v-model="form.gender"
                          class="accent-emerald-600"
                        />
                        其它
                      </label>
                      <label class="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          value="不透露"
                          v-model="form.gender"
                          class="accent-emerald-600"
                        />
                        不透露
                      </label>
                    </div>
                  </div>

                  <label class="block">
                    <div class="mb-1 text-sm font-medium">聯絡電話</div>
                    <input
                      v-model.trim="form.phone"
                      type="tel"
                      class="w-full h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="請輸入手機"
                    />
                  </label>

                  <label class="block sm:col-span-2">
                    <div
                      class="mb-1 text-sm font-medium after:content-['*'] after:text-rose-500"
                    >
                      通知信箱
                    </div>
                    <input
                      v-model.trim="form.email"
                      type="email"
                      class="w-full h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="name@example.com"
                    />
                  </label>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  class="h-10 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  @click="cancelBasic()"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  @click="saveBasic()"
                >
                  更新
                </button>
              </div>
            </div>
          </template>
        </Card>

        <!-- 求職偏好 -->
        <Card
          :pt="cardPt"
          class="scroll-mt-24 md:scroll-mt-28 rounded-xl ring-1 ring-black/5 overflow-hidden"
          :id="'job'"
        >
          <template #header>
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
            >
              <h3 class="text-lg font-semibold text-gray-900">求職偏好</h3>
              <button
                v-if="!editingJob"
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-50"
                @click="onEditJob('job')"
              >
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </template>

          <template #content>
            <!-- 顯示態 -->
            <div v-if="!editingJob" class="p-5 space-y-4">
              <div class="grid grid-cols-[180px_1fr] gap-3">
                <div class="text-lg text-gray-500">求職狀態</div>
                <div class="text-gray-900">
                  {{ jobPref.status }}
                  <ul class="mt-2 list-disc pl-5 text-xs text-gray-500 space-y-1">
                    <li v-for="(n, i) in jobNotes" :key="i">{{ n }}</li>
                  </ul>
                </div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">職缺類別偏好</div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="t in jobPref.categories"
                    :key="t"
                    class="inline-flex items-center px-3 py-1 rounded-full text-lg bg-sky-50 text-sky-700"
                  >
                    {{ t }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">期望工作地點</div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="c in jobPref.cities"
                    :key="c"
                    class="inline-flex items-center px-4 py-1 rounded-sm text-base bg-blue-50 text-blue-700"
                  >
                    {{ c }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3">
                <div class="text-lg text-gray-500">工作模式偏好</div>
                <div class="text-gray-900">{{ jobPref.mode }}</div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3">
                <div class="text-lg text-gray-500">期望薪資</div>
                <div class="text-gray-900">
                  {{ salaryUnitLabel }}
                  {{ jobPref.salaryAmount }}
                </div>
              </div>
            </div>

            <!-- 編輯態 -->
            <div v-else class="p-5 space-y-6">
              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">您目前的求職狀態？</div>
                <div class="space-y-3">
                  <div class="flex flex-wrap gap-3">
                    <label class="inline-flex items-center gap-2">
                      <RadioButton
                        name="status"
                        value="積極求職中"
                        v-model="jobForm.status"
                      />
                      <span>積極求職中</span>
                    </label>
                    <label class="inline-flex items-center gap-2">
                      <RadioButton
                        name="status"
                        value="考慮嘗試新的機會"
                        v-model="jobForm.status"
                      />
                      <span>考慮嘗試新的機會</span>
                    </label>
                    <label class="inline-flex items-center gap-2">
                      <RadioButton
                        name="status"
                        value="目前不考慮換工作"
                        v-model="jobForm.status"
                      />
                      <span>目前不考慮換工作</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">您想要投遞的職缺類別？</div>
                <MultiSelect
                  v-model="jobForm.categories"
                  :options="categoryGroups"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  display="chip"
                  :pt="selectPt"
                  placeholder="至多五項"
                  class="w-full"
                />
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">您期望的工作地點？</div>
                <MultiSelect
                  v-model="jobForm.cities"
                  :options="cityGroups"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  display="chip"
                  :pt="selectPt"
                  placeholder="至多五項"
                  class="w-full"
                />
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-start">
                <div class="text-lg text-gray-500">您偏好的工作模式？</div>
                <div class="flex flex-wrap gap-3">
                  <label class="inline-flex items-center gap-2">
                    <RadioButton name="mode" value="進辦公室" v-model="jobForm.mode" />
                    <span>進辦公室</span>
                  </label>
                  <label class="inline-flex items-center gap-2">
                    <RadioButton name="mode" value="部分遠端" v-model="jobForm.mode" />
                    <span>部分遠端</span>
                  </label>
                  <label class="inline-flex items-center gap-2">
                    <RadioButton name="mode" value="完全遠端" v-model="jobForm.mode" />
                    <span>完全遠端</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-[180px_1fr] gap-3 items-center">
                <div class="text-lg text-gray-500">您的期望薪資？</div>
                <div class="flex items-center gap-3">
                  <Select
                    v-model="jobForm.salaryUnit"
                    :options="salaryUnits"
                    optionLabel="label"
                    optionValue="value"
                    class="w-28"
                  />
                  <InputText
                    v-model="jobForm.salaryAmount"
                    class="w-64"
                    placeholder="40,000"
                  />
                  <span class="text-gray-600">元以上</span>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <Button label="取消" severity="secondary" outlined @click="onCancelJob" />
                <Button label="更新" severity="primary" @click="onSaveJob" />
              </div>
            </div>
          </template>
        </Card>

        <!-- 興趣主題 -->
        <Card
          :pt="cardPt"
          class="scroll-mt-24 md:scroll-mt-28 rounded-xl ring-1 ring-black/5 overflow-hidden"
          :id="'topics'"
        >
          <template #header>
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
            >
              <h3 class="text-lg font-semibold text-gray-900">興趣主題</h3>
              <button
                v-if="!editingTopics"
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-50"
                @click="onEditTopics()"
              >
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </template>

          <template #content>
            <!-- 顯示態 -->
            <div v-if="!editingTopics" class="p-5">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="t in topicsSelected"
                  :key="t"
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-sky-600 text-white"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <!-- 編輯態 -->
            <div v-else class="p-5 space-y-4">
              <div class="text-sm text-gray-500">點擊可選 / 取消（可多選）</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="t in topicOptions"
                  :key="t"
                  type="button"
                  class="px-3 py-1.5 rounded-full text-sm ring-1 ring-black/5 transition"
                  :class="
                    topicsForm.includes(t)
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  @click="toggleTopic(t)"
                >
                  {{ t }}
                </button>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <Button
                  label="取消"
                  severity="secondary"
                  outlined
                  @click="onCancelTopics"
                />
                <Button label="更新" severity="primary" @click="onSaveTopics" />
              </div>
            </div>
          </template>
        </Card>

        <!-- 帳號設定 -->
        <Card
          :pt="cardPt"
          class="scroll-mt-24 md:scroll-mt-28 rounded-xl ring-1 ring-black/5 overflow-hidden"
          :id="'account'"
        >
          <template #header>
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
            >
              <h3 class="text-lg font-semibold text-gray-900">帳號設定</h3>
            </div>
          </template>
          <template #content>
            <div class="p-5 space-y-4">
              <div
                class="flex items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-b-0"
              >
                <div class="flex items-center min-w-0 text-gray-900 gap-10">
                  <img
                    src="@/assets/imgs/google_logo.png"
                    alt="google_logo"
                    class="w-5 h-5"
                  />
                  <span class="truncate">{{ profile.email }}</span>
                </div>
                <button class="text-lg" @click="onAction('change-password')">
                  修改密碼
                </button>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-b-0"
              >
                <div class="flex items-center min-w-0 text-gray-900 gap-10">
                  <img
                    src="@/assets/imgs/github_icon.png"
                    alt="github_icon"
                    class="w-5 h-5"
                  />
                  <span>{{ profile.name }}</span>
                </div>
                <button class="text-lg" @click="onAction('unbind-google')">
                  解除綁定
                </button>
              </div>
            </div>
          </template>
        </Card>
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import MultiSelect from "primevue/multiselect";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

/* 左側選單 */
const sections = [
  { key: "basic", label: "基本資料" },
  { key: "job", label: "求職偏好" },
  { key: "topics", label: "興趣主題" },
  { key: "account", label: "帳號設定" },
];

const activeKey = ref("basic");

const clicking = ref(false); // 點擊側欄時暫停 scroll spy，避免跳動
let io = null; // IntersectionObserver
const ratios = Object.fromEntries(sections.map((s) => [s.key, 0])); // 每區塊可見比例

// 點擊側欄 → 平滑捲動到對應卡片
function goTo(key) {
  activeKey.value = key;
  const el = document.getElementById(key);
  if (el) {
    clicking.value = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (clicking.value = false), 700); // 與你的平滑捲動時間一致
  }
}

onMounted(() => {
  // 根據你的 sticky Top 調整 rootMargin 的上邊距；例如 top-24 ≈ 96px
  io = new IntersectionObserver(
    (entries) => {
      // 點擊捲動時先不更新
      if (clicking.value) return;

      entries.forEach((e) => {
        ratios[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
      });

      // 取目前可見比例最高的那個 section
      const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
      if (best && best[1] > 0) {
        activeKey.value = best[0];
      }
    },
    {
      root: null,
      // 讓「卡片進入視窗上方（扣掉 sticky 高度）」就開始算可見
      rootMargin: "-110px 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((s) => {
    const el = document.getElementById(s.key);
    if (el) io.observe(el);
  });
});

onBeforeUnmount(() => {
  io?.disconnect();
});

/* Card 的 padding 交給我們自己控制 */
const cardPt = {
  body: { class: "p-0" },
};

/* 基本資料 */
const profile = ref({
  name: "Chang-Hsi Ti",
  birthday: "1992/01/13",
  gender: "男",
  phone: "0972800180",
  email: "watasiwa8531@gmail.com",
  avatar:
    "https://pic.chaopx.com/chao_origin_pic/23/04/21/57aeeeef168f55a9dd96a2c7f5fc0832.jpg!/fw/572/quality/90/unsharp/true/compress/true",
});

const editingBasic = ref(false);

const form = ref({
  name: "",
  birthdayObj: null,
  gender: "",
  phone: "",
  email: "",
  avatar: "",
});

function parseToDate(s) {
  if (!s) return null;
  const parts = s.replaceAll("-", "/").split("/");
  const [y, m, d] = parts.map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}
function fmtDate(d) {
  if (!(d instanceof Date)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${dd}`;
}

function onEditBasic() {
  const p = profile.value;
  form.value = {
    name: p.name,
    birthdayObj: parseToDate(p.birthday),
    gender: p.gender || "不透露",
    phone: p.phone || "",
    email: p.email || "",
    avatar: p.avatar || "",
  };
  editingBasic.value = true;
}

function cancelBasic() {
  editingBasic.value = false;
}

function saveBasic() {
  const f = form.value;
  profile.value = {
    ...profile.value,
    name: f.name.trim(),
    birthday: fmtDate(f.birthdayObj),
    gender: f.gender,
    phone: f.phone.trim(),
    email: f.email.trim(),
    avatar: f.avatar || profile.value.avatar,
  };
  editingBasic.value = false;
}

function removeAvatar() {
  form.value.avatar = "";
}

/* 求職偏好 */
/* Select 的尺寸微調（讓 chips 更緊實） */
const selectPt = {
  root: { class: "min-h-11" },
  trigger: { class: "min-h-11" },
};

const editingJob = ref(false);

/* 群組選項：職缺類別 */
const categoryGroups = [
  {
    label: "研發 / 工程",
    items: [
      { label: "前端工程", value: "前端工程" },
      { label: "後端工程", value: "後端工程" },
      { label: "全端工程", value: "全端工程" },
      { label: "資料工程", value: "資料工程" },
    ],
  },
  {
    label: "產品 / 設計",
    items: [
      { label: "產品經理", value: "產品經理" },
      { label: "UI/UX 設計", value: "UI/UX 設計" },
    ],
  },
  {
    label: "行銷 / 內容",
    items: [
      { label: "內容行銷", value: "內容行銷" },
      { label: "社群經營", value: "社群經營" },
    ],
  },
  {
    label: "商務 / 業務",
    items: [
      { label: "商務開發", value: "商務開發" },
      { label: "通路開發", value: "通路開發" },
      { label: "實體經營", value: "實體經營" },
    ],
  },
];

/* 群組選項：城市 */
const cityGroups = [
  {
    label: "北部",
    items: [
      { label: "臺北市", value: "臺北市" },
      { label: "新北市", value: "新北市" },
      { label: "桃園市", value: "桃園市" },
    ],
  },
  {
    label: "中部",
    items: [
      { label: "新竹市", value: "新竹市" },
      { label: "臺中市", value: "臺中市" },
    ],
  },
  {
    label: "南部",
    items: [
      { label: "臺南市", value: "臺南市" },
      { label: "高雄市", value: "高雄市" },
    ],
  },
  {
    label: "東部",
    items: [{ label: "宜蘭縣", value: "宜蘭縣" }],
  },
];

const salaryUnits = [
  { label: "月薪", value: "monthly" },
  { label: "年薪", value: "yearly" },
];

const salaryUnitLabel = computed(() => {
  const hit = salaryUnits.find((u) => u.value === jobPref.value.salaryUnit);
  return hit ? hit.label : "";
});

/* 表單狀態（編輯用暫存） */
const jobPref = ref({
  status: "積極求職中",
  subscribedBestFit: true,
  subscribedMail: true,
  categories: ["前端工程"],
  cities: ["臺北市", "新北市", "桃園市"],
  mode: "進辦公室",
  salaryUnit: "monthly",
  salaryAmount: "40,000",
});

/* 編輯態表單（你原本已有，留著即可） */
const jobForm = ref({
  status: "積極求職中",
  subscribedBestFit: true,
  subscribedMail: true,
  categories: ["前端工程"],
  cities: ["臺北市", "新北市", "桃園市"],
  mode: "進辦公室",
  salaryUnit: "monthly",
  salaryAmount: "40,000",
});

/* 點鉛筆→載入儲存值到表單並進入編輯態 */
function onEditJob() {
  jobForm.value = {
    status: jobPref.value.status,
    subscribedBestFit: jobPref.value.subscribedBestFit,
    subscribedMail: jobPref.value.subscribedMail,
    categories: [...jobPref.value.categories],
    cities: [...jobPref.value.cities],
    mode: jobPref.value.mode,
    salaryUnit: jobPref.value.salaryUnit,
    salaryAmount: jobPref.value.salaryAmount,
  };
  editingJob.value = true;
}

/* 儲存→覆蓋顯示態資料並退出編輯 */
function onSaveJob() {
  jobPref.value = { ...jobPref.value, ...jobForm.value };
  editingJob.value = false;
}

/* 取消→不變更，退出編輯 */
function onCancelJob() {
  editingJob.value = false;
}

// 興趣主題：顯示用選取值
const topicsSelected = ref(["自我成長", "AI / 數位工具", "面試技巧", "轉職 / 離職"]);

// 題庫（可按需求增減）
const topicOptions = [
  "人物／企業專訪",
  "綜合求職攻略",
  "數位產業知識",
  "職涯觀點",
  "人資招募策略",
  "自我成長",
  "AI / 數位工具",
  "日本求職攻略",
  "會員限定課程",
  "履歷／求職信撰寫",
  "人資趨勢",
  "English Career Guide",
  "健康／生活",
  "時事話題",
  "活動速報",
];

// 編輯態狀態與表單
const editingTopics = ref(false);
const topicsForm = ref([]);

// 進入編輯
function onEditTopics() {
  topicsForm.value = [...topicsSelected.value];
  editingTopics.value = true;
}

// 取消編輯
function onCancelTopics() {
  editingTopics.value = false;
}

// 儲存編輯
function onSaveTopics() {
  topicsSelected.value = [...topicsForm.value];
  editingTopics.value = false;
}

// 切換選取
function toggleTopic(t) {
  const idx = topicsForm.value.indexOf(t);
  if (idx >= 0) topicsForm.value.splice(idx, 1);
  else topicsForm.value.push(t);
}

function onAction(act) {
  console.log("action:", act);
}
</script>
