<!-- src/components/class/ClassMain.vue -->
<template>
  <div class="space-y-6">
    <section class="rounded-xl bg-gray-50 p-5">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">關於課程</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-clone text-emerald-600"></i>
          </div>
          <div class="text-sm text-gray-700 leading-5">
            包含 1 章 30 單元・5 項作業・1 份測驗
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-clock text-emerald-600"></i>
          </div>
          <div class="text-sm text-gray-700 leading-5">9 時 56 分鐘</div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-users text-emerald-600"></i>
          </div>
          <div class="text-sm text-gray-700 leading-5">7356 位同學</div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <i class="pi pi-check-circle text-emerald-600"></i>
          </div>
          <div class="text-sm text-gray-700 leading-5">
            不限觀看次數，還會附贈完課證書
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-xl bg-gray-50">
      <div class="flex items-center justify-between px-5 py-3">
        <h3 class="text-base font-semibold text-gray-900">最新消息</h3>
        <button class="text-sm text-emerald-600 hover:text-emerald-700">展開消息</button>
      </div>
    </section>

    <section class="rounded-xl bg-white ring-1 ring-black/5">
      <div class="px-5 py-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">課程內容</h3>
      </div>
      <div class="border-t border-gray-300"></div>
      <div class="p-3 md:p-5">
        <div class="rounded-xl overflow-hidden ring-1 ring-black/5 bg-white">
          <iframe
            ref="introFrame"
            :src="introUrl"
            class="w-full block"
            title="Python 課程介紹"
            frameborder="0"
            scrolling="no"
            style="border: 0; overflow: hidden"
          ></iframe>
        </div>
      </div>
    </section>

    <section class="rounded-xl bg-white ring-1 ring-black/5">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-300">
        <div class="flex items-center gap-3 flex-wrap">
          <h3 class="text-lg font-semibold text-gray-900">單元一覽</h3>
          <div class="text-sm text-gray-500">
            {{ chapters.length }} 章 {{ totalLessons }} 單元｜總時長
            {{ totalMinutes }} 分鐘
          </div>
        </div>
        <button
          class="text-sm text-emerald-600 hover:text-emerald-700"
          @click="toggleAll()"
        >
          {{ allCollapsed ? "全部展開" : "全部收合" }}
        </button>
      </div>

      <div v-for="(ch, ci) in chapters" :key="ch.id" class="border-b last:border-b-0">
        <button
          class="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50"
          @click="toggleChapter(ci)"
        >
          <span
            class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold"
            >{{ String(ci + 1) }}</span
          >
          <span class="flex-1 text-gray-900 font-medium">{{ ch.title }}</span>
          <i
            :class="[
              'pi',
              expanded[ci] ? 'pi-chevron-up' : 'pi-chevron-down',
              'text-gray-500',
            ]"
          ></i>
        </button>

        <div v-show="expanded[ci]" class="px-2 pb-3">
          <ul>
            <li
              v-for="(u, ui) in ch.units"
              :key="u.id"
              class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50"
            >
              <span class="w-8 shrink-0 text-[13px] text-emerald-700 font-semibold">
                {{ String(ui + 1).padStart(2, "0") }}
              </span>
              <i
                class="pi"
                :class="u.type === 'assignment' ? 'pi-file-edit' : 'pi-play'"
              ></i>
              <div class="min-w-0 flex-1">
                <div class="truncate text-gray-800">{{ u.title }}</div>
                <div v-if="u.type === 'assignment'" class="text-[11px] text-gray-500">
                  作業
                </div>
              </div>
              <span
                v-if="u.preview"
                class="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                >試看單元</span
              >
              <span class="ml-2 text-xs text-gray-500 whitespace-nowrap">{{
                u.duration
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="rounded-xl bg-white ring-1 ring-black/5">
      <div class="flex items-end justify-between px-5 pt-5">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">課程評價</h3>
          <div class="mt-2 flex items-center gap-3 flex-wrap">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold text-gray-900">{{
                avgRating.toFixed(1)
              }}</span>
              <span class="text-gray-500">/ 5.0</span>
            </div>
            <Rating :modelValue="5" :cancel="false" readonly :pt="ratingPtSm" />
            <div class="text-sm text-gray-500">{{ reviewCount }} 則評價</div>
          </div>
        </div>
        <button class="text-sm text-emerald-600 hover:text-emerald-700">所有評價</button>
      </div>

      <div class="p-5 grid grid-cols-12 gap-4">
        <article
          v-for="r in reviews"
          :key="r.id"
          class="col-span-12 md:col-span-6 rounded-xl ring-1 ring-black/5 bg-white p-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm text-gray-600"
            >
              <img v-if="r.avatar" :src="r.avatar" class="w-full h-full object-cover" />
              <span v-else>{{ r.name.slice(0, 1) }}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="font-medium text-gray-900 truncate">{{ r.name }}</div>
                <div class="text-xs text-gray-400">{{ r.date }}</div>
              </div>
              <Rating :modelValue="r.rating" :cancel="false" readonly :pt="ratingPtXs" />
            </div>
          </div>

          <h4 class="mt-3 font-semibold text-gray-900">{{ r.title }}</h4>

          <p
            class="mt-2 text-sm text-gray-700"
            :class="expanded2[r.id] ? '' : 'line-clamp-3'"
          >
            {{ r.content }}
          </p>

          <div class="mt-2">
            <button
              class="text-sm text-emerald-600 hover:text-emerald-700"
              @click="toggleExpand(r.id)"
            >
              {{ expanded2[r.id] ? "收合" : "查看更多" }}
            </button>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Button
                size="small"
                outlined
                @click="markHelpful(r)"
                :pt="{ root: { class: '!h-8' } }"
              >
                <i class="pi pi-thumbs-up mr-2"></i> 有幫助
              </Button>
              <div class="text-xs text-gray-500">{{ r.helpful }} 人覺得有幫助</div>
            </div>
            <button class="text-xs text-gray-400 hover:text-gray-600">回報</button>
          </div>
        </article>
      </div>
    </section>

    <!-- 關於講師 -->
    <section class="rounded-xl bg-white ring-1 ring-black/5">
      <div class="px-5 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">關於講師</h3>
      </div>

      <div class="p-5">
        <div class="rounded-xl bg-gray-50 p-5 ring-1 ring-black/5">
          <div class="flex items-start gap-4">
            <!-- Logo / 代表圖 -->
            <div
              class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-black/5 bg-white"
            >
              <img
                :src="instructor.logoText"
                alt="講師頭像"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- 內容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-3">
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ instructor.name }}
                </h4>
                <Button
                  size="small"
                  outlined
                  @click="goInstructor"
                  :pt="{ root: { class: '!h-9' } }"
                >
                  前往講師頁面 <i class="pi pi-arrow-right ml-2"></i>
                </Button>
              </div>

              <!-- 統計 -->
              <div class="mt-1 flex items-center gap-4 text-sm flex-wrap">
                <span class="text-emerald-600">
                  <span class="font-semibold">{{ instructor.stats.courses }}</span> 堂課程
                </span>
                <span class="text-gray-500">
                  <span class="font-semibold">{{ instructor.stats.articles }}</span>
                  篇文章
                </span>
                <span class="text-sky-600">
                  <span class="font-semibold">
                    {{ instructor.stats.students.toLocaleString() }}
                  </span>
                  位學生
                </span>
              </div>

              <!-- 簡介 -->
              <p class="mt-3 text-gray-700 leading-7 whitespace-pre-line">
                {{ instructor.desc }}
              </p>

              <!-- 官方網站 -->
              <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <i class="pi pi-external-link text-gray-500"></i>
                <span>更多資訊請見 CSF 網站：</span>
                <a
                  :href="instructor.site.url"
                  target="_blank"
                  rel="noopener"
                  class="text-emerald-600 hover:text-emerald-700 underline break-all"
                >
                  {{ instructor.site.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 購課前問答 -->
    <section class="rounded-xl bg-white ring-1 ring-black/5">
      <div class="px-5 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">購課前問答</h3>
      </div>

      <div class="p-5 space-y-5">
        <!-- 登入後的留言輸入框 -->
        <div
          v-if="isLoggedIn"
          class="rounded-xl ring-1 ring-black/5 bg-gray-50 p-4 flex items-start gap-3"
        >
          <img
            :src="me?.picture"
            alt="me"
            class="w-9 h-9 rounded-full object-cover ring-1 ring-black/5"
          />
          <div class="flex-1 min-w-0">
            <textarea
              v-model="composer"
              rows="2"
              class="w-full resize-none rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2 text-sm"
              placeholder="在這邊確認你的學習需求或盲點，與老師同學交流討論！"
            ></textarea>

            <div class="mt-2 flex items-center justify-between text-xs text-gray-600">
              <div class="flex items-center gap-1">
                <i class="pi pi-info-circle mr-1"></i>
                在提出問題之前，先看看
                <a class="text-emerald-600 hover:text-emerald-700 underline">常見問題</a>
                ，是否有你想問的問題吧
              </div>
              <button
                class="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9 px-4 disabled:opacity-50"
                :disabled="!composer.trim()"
                @click="postQuestion"
              >
                送出
              </button>
            </div>
          </div>
        </div>

        <!-- 問答列表 -->
        <article
          v-for="q in qaList"
          :key="q.id"
          class="rounded-xl ring-1 ring-black/5 bg-white p-4"
        >
          <!-- 問題本體 -->
          <div class="flex items-start gap-3">
            <img
              :src="q.author.avatar || defaultAvatar"
              alt=""
              class="w-10 h-10 rounded-full object-cover ring-1 ring-black/5"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 text-sm">
                <div class="font-medium text-gray-900 truncate">{{ q.author.name }}</div>
                <div class="text-gray-400">{{ q.date }}</div>
              </div>
              <p class="mt-1 text-gray-800">
                {{ q.content }}
              </p>

              <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <button
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="q._replyOpen = !q._replyOpen"
                >
                  <i class="pi pi-comments"></i> 回覆
                </button>
                <button
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="likeQuestion(q)"
                  :disabled="q._liked"
                >
                  <i class="pi pi-thumbs-up"></i> {{ q.likes }}
                </button>
                <button class="hover:text-gray-700 inline-flex items-center gap-1">
                  <i class="pi pi-flag"></i> 檢舉
                </button>
              </div>
            </div>
          </div>

          <!-- 老師或助教回覆 -->
          <div
            v-for="r in q.replies"
            :key="r.id"
            class="mt-4 ml-10 pl-4 border-l border-gray-200"
          >
            <div class="flex items-start gap-3">
              <img
                :src="r.author.avatar || defaultAvatar"
                alt=""
                class="w-9 h-9 rounded-full object-cover ring-1 ring-black/5"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 text-sm">
                  <div class="font-medium text-gray-900 truncate">
                    {{ r.author.name }}
                  </div>
                  <span
                    v-if="r.author.isTeacher"
                    class="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    >授課老師</span
                  >
                  <div class="text-gray-400">{{ r.date }}</div>
                </div>
                <p class="mt-1 text-gray-800">{{ r.content }}</p>
              </div>
            </div>
          </div>

          <!-- 登入後可對該題回覆（簡易） -->
          <div v-if="isLoggedIn && q._replyOpen" class="mt-3 ml-10 pl-4">
            <div class="flex items-start gap-3">
              <img
                :src="me?.picture || defaultAvatar"
                alt=""
                class="w-8 h-8 rounded-full object-cover ring-1 ring-black/5"
              />
              <div class="flex-1 min-w-0">
                <textarea
                  v-model="q._replyText"
                  rows="2"
                  class="w-full resize-none rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2 text-sm"
                  placeholder="撰寫回覆⋯"
                ></textarea>
                <div class="mt-2 text-right">
                  <button
                    class="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-8 px-3 disabled:opacity-50"
                    :disabled="!(q._replyText && q._replyText.trim())"
                    @click="postReply(q)"
                  >
                    回覆
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import Rating from "primevue/rating";
import Button from "primevue/button";

/* 內嵌課程介紹 HTML（同源可量測高度） */
const introUrl = new URL("../../assets/docs/python-course-intro.html", import.meta.url)
  .href;

const introFrame = ref(null);
let resizeObserver = null;

function setIframeHeight() {
  try {
    const frame = introFrame.value;
    if (!frame) return;
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) return;
    const styleEl = doc.createElement("style");
    styleEl.textContent = `html,body{overflow:hidden !important;}`;
    doc.head.appendChild(styleEl);
    const h = Math.max(
      doc.documentElement?.scrollHeight || 0,
      doc.body?.scrollHeight || 0
    );
    frame.style.height = h + "px";
  } catch (e) {}
}

onMounted(() => {
  const frame = introFrame.value;
  if (!frame) return;
  frame.addEventListener("load", () => {
    setIframeHeight();
    try {
      const doc = frame.contentDocument || frame.contentWindow?.document;
      if (!doc) return;
      resizeObserver = new ResizeObserver(() => setIframeHeight());
      resizeObserver.observe(doc.documentElement);
      resizeObserver.observe(doc.body);
      Array.from(doc.images || []).forEach((img) =>
        img.addEventListener("load", setIframeHeight)
      );
    } catch {}
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

/* 靜態章節/單元資料 */
const chapters = ref([
  {
    id: "ch1",
    title: "本課程不分章節",
    units: [
      {
        id: "u01",
        title: "單元 1－建置開發環境｜Python 與 Anaconda 的安裝與設定",
        duration: "09:40",
      },
      {
        id: "u02",
        title: "單元 2－開發環境的操作與使用｜Python 與 Anaconda 工具的操作說明",
        duration: "16:26",
      },
      { id: "u03", title: "單元 3－基本程式設計（一）｜變數與常數_1", duration: "15:24" },
      { id: "u04", title: "單元 4－基本程式設計（一）｜變數與常數_2", duration: "14:39" },
      { id: "u05", title: "單元 5－基本程式設計（一）｜變數與常數_3", duration: "19:15" },
      { id: "u06", title: "單元 6－基本程式設計（二）｜範例講題", duration: "14:09" },
      {
        id: "u07",
        title: "單元 7－基本程式設計（三）｜格式化輸出及範例試題_1",
        duration: "20:08",
      },
      {
        id: "u08",
        title: "單元 8－基本程式設計（三）｜格式化輸出及範例試題_2",
        duration: "09:05",
      },
      {
        id: "u09",
        title: "單元 9－邏輯敘述｜與範例講解",
        duration: "21:25",
        preview: true,
      },
      { id: "u10", title: "單元 10－迴圈敘述｜for 與範例講解（一）", duration: "23:51" },
      { id: "u11", title: "單元 11－迴圈敘述｜for 與範例講解（二）", duration: "18:17" },
      { id: "u12", title: "單元 12－迴圈敘述｜while 與範例講解", duration: "20:29" },
      { id: "u13", title: "單元 13－進階控制流程（一）", duration: "21:05" },
      {
        id: "u14",
        title: "作業 1－倍數的個數與總和",
        duration: "00:00",
        type: "assignment",
      },
      { id: "u15", title: "單元 14－進階控制流程（二）", duration: "16:12" },
      {
        id: "u16",
        title: "單元 15－函式（Function）｜函式的建立、運作與範例（一）",
        duration: "15:13",
      },
      {
        id: "u17",
        title: "作業 2－開 n 次方根函式",
        duration: "00:00",
        type: "assignment",
      },
      {
        id: "u18",
        title: "單元 16－函式（Function）｜函式的建立、運作與範例（二）",
        duration: "24:33",
      },
    ],
  },
]);

/* 章節展開控制 */
const expanded = ref(chapters.value.map((_, i) => i === 0));

function toggleChapter(index) {
  expanded.value[index] = !expanded.value[index];
}
const allCollapsed = computed(() => expanded.value.every((e) => !e));
function toggleAll() {
  const target = allCollapsed.value ? true : false;
  expanded.value = expanded.value.map(() => target);
}

/* 統計資訊 */
const totalLessons = computed(() =>
  chapters.value.reduce((sum, ch) => sum + ch.units.length, 0)
);
function toMinutes(t) {
  const [m = "0"] = String(t || "0:00").split(":");
  return parseInt(m, 10) || 0; // 以分鐘估算（忽略秒）
}
const totalMinutes = computed(() =>
  chapters.value.reduce(
    (sum, ch) => sum + ch.units.reduce((s, u) => s + toMinutes(u.duration), 0),
    0
  )
);

/* 學生評價區塊 */
const reviews = ref([
  {
    id: "r1",
    name: "olivialiwen",
    date: "2022-08-23",
    rating: 5,
    title: "Python入門的必修課（精華濃縮）",
    content:
      "老師的課是我的第一門 Python 課，去年就已經學習完畢，剛學習時心情很單純，Python 簡單易懂的特點，讓我也會愛上它。實作示例多、觀念清楚，課後複習也很方便。",
    helpful: 29,
    avatar: "",
  },
  {
    id: "r2",
    name: "Maria Lee",
    date: "2022-04-30",
    rating: 5,
    title: "程式小白的敲門磚",
    content:
      "在上這門課以前，我只是個大聲程式小白。課程結構清楚、步驟也不難，理解自己哪裡卡住了，跟著實作與練習馬上就能看見進步。在作業一次次驗證觀念是否正確的過程中，信心也慢慢建立起來。",
    helpful: 18,
    avatar: "",
  },
]);

const expanded2 = ref({});
function toggleExpand(id) {
  expanded2.value[id] = !expanded2.value[id];
}
function markHelpful(r) {
  if (r._voted) return;
  r.helpful++;
  r._voted = true;
}

const avgRating = computed(() => 5.0);
const reviewCount = computed(() => 617);

const ratingPtSm = {
  onIcon: { class: "pi pi-star-fill text-amber-400 text-base" },
  offIcon: { class: "pi pi-star text-amber-300 text-base" },
};
const ratingPtXs = {
  onIcon: { class: "pi pi-star-fill text-amber-400 text-sm" },
  offIcon: { class: "pi pi-star text-amber-300 text-sm" },
};

/* 靜態講師資料 */
const instructor = ref({
  name: "電腦技能基金會",
  logoText:
    "https://bpic.588ku.com/element_pic/23/08/04/2f3a2316d39e2d55b77ede597887e176.jpg!/fw/350/quality/99/unsharp/true/compress/true",
  stats: {
    courses: 8,
    articles: 0,
    students: 12865,
  },
  desc:
    "電腦技能基金會（CSF）深耕認證領域三十年，發展各項能力認證，已成為全國最大、最具公信力的認證機構。" +
    "持續推動學校學習及職場應用的橋接角色，同時與公部門與企業合作促進創新應用，推廣人才培育計畫。" +
    "目前國內已有 500 多家大專校院及高中職夥伴合作，擁有 150 家授權訓練中心，服務網絡遍佈全國。",
  site: {
    label: "https://www.csf.org.tw/csfnew/",
    url: "https://www.csf.org.tw/csfnew/",
  },
});

/* 只是畫面：這裡先做示意動作 */
function goInstructor() {
  console.log("前往講師頁面");
}

/* Auth 狀態 */
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);
const me = computed(() => auth.user || null);
const defaultAvatar =
  "https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/user.svg";

/* 假資料：購課前問答 */
const qaList = ref([
  {
    id: "q1",
    date: "2025-08-21",
    author: {
      name: "邱玟娟",
      avatar: "https://i.pravatar.cc/100?img=66",
    },
    content: "課程中提到的課程講義在哪裡下載",
    likes: 0,
    replies: [
      {
        id: "r1",
        date: "2025-08-21",
        author: {
          name: "電腦技能基金會",
          isTeacher: true,
          avatar:
            "https://pic.chaopx.com/chao_origin_pic/23/04/21/57aeeeef168f55a9dd96a2c7f5fc0832.jpg!/fw/572/quality/90/unsharp/true/compress/true",
        },
        content: "在第一章－單元 1 裡的「老師的話」中（已補錄）。",
      },
    ],
  },
  {
    id: "q2",
    date: "2025-06-28",
    author: {
      name: "謝明益",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    content:
      "repo.anaconda.com 這個網站似乎沒有明顯連結，能否有教學影片教導最新下載方式呢？",
    likes: 0,
    replies: [
      {
        id: "r2",
        date: "2025-06-29",
        author: {
          name: "電腦技能基金會",
          isTeacher: true,
          avatar:
            "https://pic.chaopx.com/chao_origin_pic/23/04/21/57aeeeef168f55a9dd96a2c7f5fc0832.jpg!/fw/572/quality/90/unsharp/true/compress/true",
        },
        content:
          "請從官網左側選單進入 View All Installers，第一個連結 Anaconda3-…-Windows-x86_64.exe 即可下載。",
      },
    ],
  },
]);

/* 送出新問題（登入者） */
const composer = ref("");
function postQuestion() {
  const text = composer.value.trim();
  if (!text) return;
  qaList.value.unshift({
    id: "q" + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    author: {
      name: me.value?.name || "我",
      avatar: me.value?.picture || "",
    },
    content: text,
    likes: 0,
    replies: [],
  });
  composer.value = "";
}

/* 對單一問題按讚 */
function likeQuestion(q) {
  if (q._liked) return;
  q.likes++;
  q._liked = true;
}

/* 對問題回覆（登入者） */
function postReply(q) {
  const text = (q._replyText || "").trim();
  if (!text) return;
  q.replies.push({
    id: "r" + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    author: {
      name: me.value?.name || "我",
      avatar: me.value?.picture || "",
      isTeacher: false,
    },
    content: text,
  });
  q._replyText = "";
  q._replyOpen = false;
}
</script>
