<!-- src/views/resume/ResumeCreate.vue -->
<template>
  <section class="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-100">
    <ThemeToolbar
      class="fixed top-[65px] right-[20px] z-50"
      v-model:color="ui.color"
      v-model:template="ui.template"
    />
    <div class="grid grid-cols-12 gap-6">
      <!-- 設置區塊 -->
      <div class="col-span-12 lg:col-span-6">
        <div class="lg:col-scroll lg:pr-2">
          <form class="space-y-6 mx-10" @submit.prevent="save">
            <div class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5 space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">基本資料</h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">姓名 *</label>
                  <InputText
                    v-model.trim="resume.basic.name"
                    placeholder="請輸入姓名"
                    class="w-full"
                  />
                </div>

                <div class="sm:col-span-1">
                  <label class="block text-sm text-gray-600 mb-1">頭像</label>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="openAvatarPicker"
                      class="w-16 h-16 rounded-full ring-1 ring-black/5 overflow-hidden bg-gray-100 p-0"
                      aria-label="上傳頭像"
                    >
                      <img
                        :src="resume.basic.avatarUrl || defaultAvatar"
                        class="w-full h-full object-cover"
                      />
                    </button>
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      class="sr-only"
                      @change="pickAvatar"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">性別</label>
                  <Dropdown
                    v-model="resume.basic.gender"
                    :options="genders"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">生日</label>
                  <DatePicker
                    v-model="resume.basic.birthday"
                    showIcon
                    iconDisplay="input"
                    inputId="birthday"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">電話</label>
                  <InputText v-model.trim="resume.basic.phone" class="w-full" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">聯絡信箱 *</label>
                  <InputText v-model.trim="resume.basic.email" class="w-full" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">網站標題</label>
                  <InputText
                    v-model.trim="resume.basic.siteTitle"
                    class="w-full"
                    placeholder="個人網站 / GitHub"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm text-gray-600 mb-1">網站連結</label>
                  <InputText
                    v-model.trim="resume.basic.siteUrl"
                    class="w-full"
                    placeholder="https://…"
                  />
                </div>

                <div class="sm:col-span-3">
                  <label class="block text-sm text-gray-600 mb-1">簡歷</label>
                  <Editor
                    v-model="resume.basic.summary"
                    placeholder="簡潔的寫上你的「人格特質」、「職務背景」、「重點能力」、「職涯目標」等"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="!showEducations || !showSkills || !showExperiences || !showProjects"
              class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5"
            >
              <div class="text-gray-600 text-sm">尚未輸入欄位</div>
              <div class="mt-3 flex flex-wrap gap-4">
                <button
                  v-if="!showEducations"
                  type="button"
                  class="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
                  @click="ensureEdu()"
                >
                  <i class="pi pi-plus"></i> 學歷
                </button>
                <button
                  v-if="!showSkills"
                  type="button"
                  class="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
                  @click="ensureSkill()"
                >
                  <i class="pi pi-plus"></i> 專業技能
                </button>
                <button
                  v-if="!showExperiences"
                  type="button"
                  class="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
                  @click="ensureExp()"
                >
                  <i class="pi pi-plus"></i> 工作經驗
                </button>
                <button
                  v-if="!showProjects"
                  type="button"
                  class="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
                  @click="ensureProj()"
                >
                  <i class="pi pi-plus"></i> 專案與作品集
                </button>
              </div>
            </div>

            <draggable
              v-model="sectionItems"
              item-key="key"
              handle=".drag-handle"
              :animation="200"
              ghost-class="drag-ghost"
              chosen-class="drag-chosen"
            >
              <template #item="{ element }">
                <div
                  v-if="element.key === 'edu' && showEducations"
                  class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5 space-y-4 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900">學歷</h2>
                    <div class="flex items-center gap-2">
                      <Button
                        size="small"
                        icon="pi pi-plus"
                        label="新增學歷"
                        outlined
                        @click="addEdu"
                      />
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 drag-handle"
                        title="拖曳排序"
                      >
                        <i class="pi pi-arrows-alt"></i>
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        :aria-expanded="!collapse.edu"
                        @click="toggleCollapse('edu')"
                        title="展開 / 收起"
                      >
                        <i
                          :class="[
                            'pi',
                            collapse.edu ? 'pi-angle-right' : 'pi-angle-down',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <Transition name="cv-collapse">
                    <div v-show="!collapse.edu" class="overflow-hidden">
                      <div
                        v-for="(edu, i) in resume.educations"
                        :key="'edu' + i"
                        class="grid grid-cols-1 gap-4 border-b border-gray-300 last:border-b-0 mb-7"
                      >
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm text-gray-600 mb-1"
                              >學校名稱 *</label
                            >
                            <InputText
                              v-model.trim="edu.school"
                              class="w-full"
                              placeholder="請輸入完整校名"
                            />
                          </div>
                          <div>
                            <label class="block text-sm text-gray-600 mb-1">學位 *</label>
                            <Dropdown
                              v-model="edu.degree"
                              :options="degreeOptions"
                              class="w-full"
                              placeholder="請選擇學位"
                            />
                          </div>
                          <div>
                            <label class="block text-sm text-gray-600 mb-1">系所 *</label>
                            <InputText
                              v-model.trim="edu.department"
                              class="w-full"
                              placeholder="請輸入科系"
                            />
                          </div>
                          <div />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm text-gray-600 mb-1"
                              >入學時間 *</label
                            >
                            <DatePicker
                              v-model="edu.start"
                              view="month"
                              dateFormat="yy/mm"
                              class="w-full"
                            />
                          </div>
                          <div>
                            <label class="block text-sm text-gray-600 mb-1"
                              >畢業時間 *</label
                            >
                            <DatePicker
                              v-model="edu.end"
                              view="month"
                              dateFormat="yy/mm"
                              class="w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm text-gray-600 mb-1">在校經歷</label>
                          <Editor
                            v-model="edu.desc"
                            placeholder="描述你在校期間的修習內容或活動參與與成果"
                          />
                        </div>

                        <div class="flex justify-end">
                          <Button
                            severity="danger"
                            text
                            icon="pi pi-trash"
                            @click="removeEdu(i)"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <div
                  v-else-if="element.key === 'skill' && showSkills"
                  class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5 space-y-4 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900">專業技能</h2>
                    <div class="flex items-center gap-2">
                      <Button
                        size="small"
                        icon="pi pi-plus"
                        label="新增技能"
                        outlined
                        @click="addSkill"
                      />
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 drag-handle"
                        title="拖曳排序"
                      >
                        <i class="pi pi-arrows-alt"></i>
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        :aria-expanded="!collapse.skill"
                        @click="toggleCollapse('skill')"
                        title="展開 / 收起"
                      >
                        <i
                          :class="[
                            'pi',
                            collapse.skill ? 'pi-angle-right' : 'pi-angle-down',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <Transition name="cv-collapse">
                    <div v-show="!collapse.skill" class="overflow-hidden">
                      <div
                        v-for="(sk, i) in resume.skillItems"
                        :key="'skill' + i"
                        class="grid grid-cols-1 gap-4 border-b border-gray-300 last:border-b-0 mb-7"
                      >
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm text-gray-600 mb-1">名稱 *</label>
                            <InputText
                              v-model.trim="sk.name"
                              class="w-full"
                              placeholder="請輸入技能名稱"
                            />
                          </div>
                          <div>
                            <label class="block text-sm text-gray-600 mb-1"
                              >熟練度 *</label
                            >
                            <Dropdown
                              v-model="sk.level"
                              :options="skillLevels"
                              class="w-full"
                              placeholder="請選擇熟練度"
                            />
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm text-gray-600 mb-1">內容描述</label>
                          <Editor
                            v-model="sk.desc"
                            placeholder="記得用職缺描述中常見的技能名稱撰寫，例如：廣告投放（o）/ 下FB廣告（x）"
                          />
                        </div>

                        <div>
                          <label class="block text-sm text-gray-600 mb-1">關鍵字</label>
                          <InputText
                            v-model.trim="sk.keywords"
                            class="w-full"
                            placeholder="請輸入技能標籤"
                          />
                        </div>

                        <div class="flex justify-end">
                          <Button
                            severity="danger"
                            text
                            icon="pi pi-trash"
                            @click="removeSkill(i)"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <div
                  v-else-if="element.key === 'exp' && showExperiences"
                  class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5 space-y-4 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900">工作經驗</h2>
                    <div class="flex items-center gap-2">
                      <Button
                        size="small"
                        icon="pi pi-plus"
                        label="新增經驗"
                        outlined
                        @click="addExp"
                      />
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 drag-handle"
                        title="拖曳排序"
                      >
                        <i class="pi pi-arrows-alt"></i>
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        :aria-expanded="!collapse.exp"
                        @click="toggleCollapse('exp')"
                        title="展開 / 收起"
                      >
                        <i
                          :class="[
                            'pi',
                            collapse.exp ? 'pi-angle-right' : 'pi-angle-down',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <Transition name="cv-collapse">
                    <div v-show="!collapse.exp" class="overflow-hidden">
                      <div
                        v-for="(exp, i) in resume.experiences"
                        :key="'exp' + i"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-300 last:border-b-0 mb-7"
                      >
                        <div>
                          <label class="block text-sm text-gray-600 mb-1">職稱 *</label>
                          <InputText
                            v-model.trim="exp.title"
                            class="w-full"
                            placeholder="請輸入職稱"
                          />
                        </div>
                        <div>
                          <label class="block text-sm text-gray-600 mb-1"
                            >公司名稱 *</label
                          >
                          <InputText
                            v-model.trim="exp.company"
                            class="w-full"
                            placeholder="請輸入公司名稱"
                          />
                        </div>

                        <div>
                          <label class="block text-sm text-gray-600 mb-1"
                            >開始時間 *</label
                          >
                          <DatePicker
                            v-model="exp.start"
                            view="month"
                            dateFormat="yy/mm"
                            class="w-full"
                          />
                        </div>
                        <div>
                          <label class="block text-sm text-gray-600 mb-1"
                            >結束時間 *</label
                          >
                          <DatePicker
                            v-model="exp.end"
                            view="month"
                            dateFormat="yy/mm"
                            class="w-full"
                          />
                        </div>

                        <div class="sm:col-span-2">
                          <label class="block text-sm text-gray-600 mb-1">內容描述</label>
                          <Editor
                            v-model="exp.desc"
                            placeholder="用列點、數字化方式描述主要工作內容與重要成就（可參考 STAR 法則）"
                          />
                        </div>

                        <div class="sm:col-span-2 flex justify-end">
                          <Button
                            severity="danger"
                            text
                            icon="pi pi-trash"
                            @click="removeExp(i)"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <div
                  v-else-if="element.key === 'proj' && showProjects"
                  class="rounded-xl ring-1 ring-black/5 bg-white shadow p-5 space-y-4 mb-4"
                >
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-900">專案與作品集</h2>
                    <div class="flex items-center gap-2">
                      <Button
                        size="small"
                        icon="pi pi-plus"
                        label="新增專案"
                        outlined
                        @click="addProject"
                      />
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 drag-handle"
                        title="拖曳排序"
                      >
                        <i class="pi pi-arrows-alt"></i>
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        :aria-expanded="!collapse.proj"
                        @click="toggleCollapse('proj')"
                        title="展開 / 收起"
                      >
                        <i
                          :class="[
                            'pi',
                            collapse.proj ? 'pi-angle-right' : 'pi-angle-down',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <Transition name="cv-collapse">
                    <div v-show="!collapse.proj" class="overflow-hidden">
                      <div
                        v-for="(p, i) in resume.projects"
                        :key="'proj' + i"
                        class="border-b border-gray-300 last:border-b-0 pb-4 space-y-4 mb-7"
                      >
                        <div
                          class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-4"
                        >
                          <div class="space-y-4">
                            <div>
                              <label class="block text-sm text-gray-600 mb-1"
                                >專案或作品集名稱 *</label
                              >
                              <InputText
                                v-model.trim="p.title"
                                class="w-full"
                                placeholder="請輸入專案名稱"
                              />
                            </div>
                            <div>
                              <label class="block text-sm text-gray-600 mb-1"
                                >相關連結</label
                              >
                              <InputText
                                v-model.trim="p.link"
                                class="w-full"
                                placeholder="https://"
                              />
                            </div>
                          </div>

                          <div class="lg:pl-2">
                            <label class="block text-sm text-gray-600 mb-1">封面</label>
                            <button
                              type="button"
                              class="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 grid place-content-center hover:bg-gray-50"
                              @click="openCoverPicker(i)"
                            >
                              <template v-if="p.coverUrl">
                                <img
                                  :src="p.coverUrl"
                                  class="w-full h-full object-cover rounded-md"
                                />
                              </template>
                              <template v-else>
                                <div class="flex flex-col items-center text-gray-400">
                                  <i class="pi pi-plus text-2xl mb-2"></i>
                                  <div class="text-xs">
                                    點擊上傳圖片<br />建議尺寸 480×360
                                  </div>
                                </div>
                              </template>
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              class="sr-only"
                              :ref="(el) => (coverInputs[i] = el)"
                              @change="pickCover(i, $event)"
                            />
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm text-gray-600 mb-1">內容描述</label>
                          <Editor v-model="p.desc" placeholder="請輸入內容描述" />
                        </div>

                        <div class="flex justify-end">
                          <Button
                            severity="danger"
                            text
                            icon="pi pi-trash"
                            @click="removeProject(i)"
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </draggable>

            <div class="flex justify-end gap-3">
              <Button label="儲存草稿" icon="pi pi-save" outlined @click="save" />
              <Button label="發佈履歷" icon="pi pi-print" @click="complete" />
            </div>
          </form>
        </div>
      </div>

      <!-- 預覽區塊 -->
      <aside class="col-span-12 lg:col-span-6">
        <div class="lg:col-scroll lg:pl-2">
          <div class="space-y-6 pb-20 mr-10">
            <ResumePreview
              :resume="resume"
              :theme="ui.theme"
              :lang="ui.lang"
              :section-order="sectionOrder"
              :primary-color="ui.color"
              :template="ui.template"
            />
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import Editor from "primevue/editor";
import Button from "primevue/button";
import ResumePreview from "@/components/resume/ResumePreview.vue";
import ThemeToolbar from "@/components/resume/ThemeToolbar.vue";
import draggable from "vuedraggable";

const router = useRouter();

const defaultAvatar =
  "https://media.istockphoto.com/id/1337144146/zh/%E5%90%91%E9%87%8F/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=P_sadMdbYdrMxYXPHD1zLsjvxKrXcl3WoFYeFX1_rcc=";

/* UI & 預覽（會存到 localStorage） */
const ui = reactive({
  theme: "classic",
  lang: "zh",
  color: "#1F6FB2",
  template: "Gradient",
});
const UI_KEY = "resume:ui";

const genders = ["不透露", "男", "女", "其他"];

/* 區塊顯示 */
const showEducations = ref(false);
const showSkills = ref(false);
const showExperiences = ref(false);
const showProjects = ref(false);

/* 簡歷資料 */
const resume = reactive({
  basic: {
    name: "",
    gender: "不透露",
    birthday: null,
    phone: "",
    email: "",
    siteTitle: "",
    siteUrl: "",
    summary: "",
    avatarUrl: "",
  },
  educations: [],
  skillItems: [],
  experiences: [],
  projects: [],
  skills: ["Vue", "Tailwind"],
});

/* 選項 */
const degreeOptions = ["學士", "碩士", "博士", "專科", "其他"];
const skillLevels = ["入門", "初階", "中階", "進階", "專家"];

/* 快速開啟 */
function ensureEdu() {
  showEducations.value = true;
  if (resume.educations.length === 0) addEdu();
}
function ensureSkill() {
  showSkills.value = true;
  if (resume.skillItems.length === 0) addSkill();
}
function ensureExp() {
  showExperiences.value = true;
  if (resume.experiences.length === 0) addExp();
}
function ensureProj() {
  showProjects.value = true;
  if (!resume.projects.length) addProject();
}

/* CRUD */
function addEdu() {
  resume.educations.push({
    school: "",
    degree: "",
    department: "",
    start: null,
    end: null,
    desc: "",
  });
}
function removeEdu(i) {
  resume.educations.splice(i, 1);
  if (resume.educations.length === 0) showEducations.value = false;
}

function addSkill() {
  resume.skillItems.push({
    name: "",
    level: "",
    desc: "",
    keywords: "",
  });
}
function removeSkill(i) {
  resume.skillItems.splice(i, 1);
  if (resume.skillItems.length === 0) showSkills.value = false;
}

function addExp() {
  resume.experiences.push({
    title: "",
    company: "",
    start: null,
    end: null,
    desc: "",
  });
}
function removeExp(i) {
  resume.experiences.splice(i, 1);
  if (resume.experiences.length === 0) showExperiences.value = false;
}

// 專案 CRUD
function addProject() {
  resume.projects.push({ title: "", link: "", coverUrl: "", desc: "" });
}
function removeProject(i) {
  resume.projects.splice(i, 1);
  if (!resume.projects.length) showProjects.value = false;
}

/* 圖片：用 DataURL 存，刷新也能顯示 */
const coverInputs = ref([]);
function openCoverPicker(i) {
  coverInputs.value?.[i]?.click?.();
}
async function pickCover(i, e) {
  const f = e.target.files?.[0];
  if (!f) return;
  resume.projects[i].coverUrl = await fileToDataUrl(f);
  e.target.value = "";
}
const avatarInput = ref(null);
function openAvatarPicker() {
  avatarInput.value?.click();
}
async function pickAvatar(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  resume.basic.avatarUrl = await fileToDataUrl(f);
  e.target.value = "";
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* 本地儲存 */
const KEY = "resume:draft";
const SECTION_ORDER_KEY = "resume:sectionOrder";

/* 拖曳順序 */
const sectionItems = ref([
  { key: "edu" },
  { key: "skill" },
  { key: "exp" },
  { key: "proj" },
]);
const sectionOrder = computed(() => sectionItems.value.map((i) => i.key));

/* 啟動時恢復 */
function rehydrateDraft() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.assign(resume.basic, data.basic || {});
    resume.educations = Array.isArray(data.educations) ? data.educations : [];
    resume.skillItems = Array.isArray(data.skillItems) ? data.skillItems : [];
    resume.experiences = Array.isArray(data.experiences) ? data.experiences : [];
    resume.projects = Array.isArray(data.projects) ? data.projects : [];
    resume.skills = Array.isArray(data.skills) ? data.skills : resume.skills;

    showEducations.value = resume.educations.length > 0;
    showSkills.value = resume.skillItems.length > 0;
    showExperiences.value = resume.experiences.length > 0;
    showProjects.value = resume.projects.length > 0;

    if (resume.basic.avatarUrl?.startsWith("blob:")) resume.basic.avatarUrl = "";
    for (const p of resume.projects) if (p.coverUrl?.startsWith("blob:")) p.coverUrl = "";
  } catch (err) {
    console.error("讀取本地草稿失敗：", err);
  }
}
function rehydrateUI() {
  const raw = localStorage.getItem(UI_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.theme) ui.theme = data.theme;
    if (data.lang) ui.lang = data.lang;
    if (data.color) ui.color = data.color;
    if (data.template) ui.template = data.template;
  } catch {}
}

onMounted(() => {
  // 區塊順序
  const saved = localStorage.getItem(SECTION_ORDER_KEY);
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      const allKeys = ["edu", "skill", "exp", "proj"];
      const valid = arr.filter((i) => allKeys.includes(i.key));
      const existing = new Set(valid.map((i) => i.key));
      for (const k of allKeys) if (!existing.has(k)) valid.push({ key: k });
      sectionItems.value = valid;
    } catch {}
  }
  // 表單 & UI
  rehydrateDraft();
  rehydrateUI();

  // 你原本的：鎖根捲軸（僅本頁）
  document.body.classList.add("no-root-scroll");
});

onUnmounted(() => {
  document.body.classList.remove("no-root-scroll");
});

/* 自動保存 */
watch(sectionItems, (v) => localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(v)), {
  deep: true,
});
watch(resume, (v) => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true });
watch(ui, (v) => localStorage.setItem(UI_KEY, JSON.stringify(v)), { deep: true });

/* 手動保存 */
function save() {
  localStorage.setItem(KEY, JSON.stringify(resume));
  localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(sectionItems.value));
  localStorage.setItem(UI_KEY, JSON.stringify(ui)); // 把顏色/樣式也一起存
}

// 讀取使用者姓名（作為路由 id）
function readUserNameFromStorage() {
  try {
    const raw = localStorage.getItem("eduviaUserInfo");
    if (!raw) return "";
    const u = JSON.parse(raw);
    return String(u?.name || "").trim();
  } catch {
    return "";
  }
}

// 轉成安全的路由參數（移除前後空白、避免出現 / 等分隔字元）
function toSafeRouteId(s) {
  if (!s) return "";
  return s.trim().replace(/\//g, "／");
}

/* 完成：先 save，再跳轉到 resumeDetail */
function complete() {
  // 先存檔（表單 + 區塊順序 + UI 狀態）
  save();

  // 從本地端拿 eduviaUserInfo.name 當作 id
  const name = readUserNameFromStorage();
  const id = toSafeRouteId(name) || "preview";

  // 跳頁（你的巢狀路由會變成 /resume/:id）
  router.push({ name: "resumeDetail", params: { id } });
}

/* 收合 */
const collapse = reactive({
  edu: false,
  skill: false,
  exp: false,
  proj: false,
});
function toggleCollapse(which) {
  collapse[which] = !collapse[which];
}
</script>

<style scoped>
/* 拖曳手感（不影響你現有的佈局與樣式） */
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.drag-ghost {
  opacity: 0.4;
}
.drag-chosen {
  outline: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
}

@media (min-width: 1024px) {
  :global(body.no-root-scroll) {
    overflow: hidden;
    height: 100dvh;
  }
  .lg\:col-scroll {
    position: sticky;
    top: 64px;
    max-height: calc(100dvh - 64px - 3rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    scrollbar-gutter: stable both-edges;
  }
}
</style>
