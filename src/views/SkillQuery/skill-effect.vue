<template>
  <div v-if="effectItem">
    <div v-if="tabVisible" class="space-x-2 mb-3 px-2">
      <cy-button-inline
        icon="bx:bxs-book-bookmark"
        class="skill-effect-tab-button"
        :selected="tabs.skillInfo"
        @click="setTab('skillInfo')"
      >
        {{ t('skill-query.skill-info') }}
      </cy-button-inline>
      <cy-button-inline
        icon="ic:round-history"
        class="skill-effect-tab-button"
        :selected="tabs.skillHistory"
        :disabled="effectItem.historys.length === 0"
        @click="setTab('skillHistory')"
      >
        {{ t('skill-query.historical-record') }}
      </cy-button-inline>
    </div>
    <div ref="skillBranchesElement">
      <div v-if="tabs.skillInfo">
        <SkillBranch
          v-for="branchItemData in skillBranchItemDatas"
          :key="branchItemData.id"
          :skill-branch-item="branchItemData.item"
        />
      </div>
      <div v-if="tabs.skillHistory">
        <SkillEffectHistory :skill-effect-item="effectItem" />
      </div>
    </div>
  </div>
  <cy-default-tips v-else icon="uil:books">
    <div>{{ t('skill-query.no-any-skill-effect-match-message.0') }}</div>
    <div>{{ t('skill-query.no-any-skill-effect-match-message.1') }}</div>
  </cy-default-tips>
  <cy-hover-float
    ref="tagHoverFloatComponent"
    :element="skillBranchesElement"
    target=".click-button--tag"
    custom
    position-mode="h-middle"
    @element-hover="tagButtonHover"
  >
    <skillTagsContent ref="tagDetailContent" :tags="currentTags" />
  </cy-hover-float>
  <cy-hover-float
    ref="skillHoverFloatComponent"
    :element="skillBranchesElement"
    target=".click-button--skill"
    @element-hover="skillButtonHover"
  >
    <div v-if="currentHoveringSkill" class="flex items-center">
      <SkillTitle :skill="currentHoveringSkill" />
      <cy-button-inline
        icon="carbon:location-current"
        class="ml-4"
        @click="emit('set-current-skill', currentHoveringSkill as Skill)"
      >
        {{ t('skill-query.go-to-skill') }}
      </cy-button-inline>
    </div>
  </cy-hover-float>
  <cy-hover-float
    ref="branchHoverFloatComponent"
    :element="skillBranchesElement"
    target=".click-button--branch"
    custom
    position-mode="h-middle"
    @element-hover="branchButtonHover"
  >
    <div v-if="currentHoveringBranch" class="bg-white bg-opacity-70">
      <SkillBranch
        :skill-branch-item="currentHoveringBranch"
        class="w-full bg-opacity-100"
        sub
        :content-auto="false"
      />
    </div>
  </cy-hover-float>
</template>

<script lang="ts">
export default {
  name: 'SkillEffect',
};
</script>

<script lang="ts" setup>
import { computed, ref, watch, toRefs, nextTick } from 'vue';
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { SkillBranchItem, SkillEffectItem } from '@/lib/Skill/SkillComputingContainer';
import { Skill, SkillRoot } from '@/lib/Skill/Skill';

import ToggleService from '@/setup/ToggleService';

import SkillBranch from './skill/skill-branch.vue';
import skillTagsContent from './skill-tags-content.vue';
import SkillEffectHistory from './skill-effect-history/index.vue';
import SkillTitle from './skill/skill-title.vue';

import { setupSkillTag } from './setup';

interface Props {
  skillEffectItem: SkillEffectItem | null;
}

interface Emits {
  (evt: 'set-current-skill', skill: Skill): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { skillEffectItem: effectItem } = toRefs(props);

const { t } = useI18n();
const { tabs, toggle } = ToggleService({
  tabs: [{ name: 'skillInfo', default: true }, 'skillHistory'] as const,
});
const store = useStore();

const setTab = (target: keyof typeof tabs) => {
  toggle(`tabs/${target}`, true, false);
};

const tabVisible = computed(() => {
  return effectItem.value?.parent.effectItems.some(item => item.historys.length > 0) ?? false;
});

const skillBranchItemDatas = computed(() => {
  if (!effectItem.value) {
    return [];
  }
  return effectItem.value.branchItems.map((item, idx) => ({
    item,
    id: `branch--${item.id !== -1 ? item.id : 'none-' + idx}`,
  }));
});

const tagDetailContent: Ref<{ $el: HTMLElement } | null> = ref(null);

const {
  currentTags,
  tagButtonHover,
} = setupSkillTag(tagDetailContent);

const skillBranchesElement: Ref<HTMLElement | null> = ref(null);
const tagHoverFloatComponent: Ref<{ update: Function } | null> = ref(null);
const skillHoverFloatComponent: Ref<{ update: Function } | null> = ref(null);
const branchHoverFloatComponent: Ref<{ update: Function } | null> = ref(null);

watch(effectItem, async () => {
  setTab('skillInfo');
  await nextTick();
  tagHoverFloatComponent.value?.update();
  skillHoverFloatComponent.value?.update();
  branchHoverFloatComponent.value?.update();
}, { immediate: true });

const currentHoveringSkill: Ref<Skill | null> = ref(null);
const skillButtonHover = (el: HTMLElement) => {
  const skillRoot = store.state.datas.Skill.skillRoot as SkillRoot;
  const skillName = el.innerText;
  let result: Skill | null = null;
  skillRoot.skillTreeCategorys.some(stc => {
    return stc.skillTrees.some(st => {
      const matchedSkill = st.skills.find(skill => skill.name === skillName);
      if (matchedSkill) {
        result = matchedSkill;
        return true;
      }
      return false;
    });
  });
  currentHoveringSkill.value = result;
};

const currentHoveringBranch: Ref<SkillBranchItem | null> = ref(null);
const branchButtonHover = (el: HTMLElement) => {
  const branchName = el.innerText;
  currentHoveringBranch.value = effectItem.value!.branchItems.find(bch => bch.attr('name') === branchName) ?? null;
};
</script>

<style lang="postcss" scoped>
.skill-effect-tab-button {
  @apply inline-flex items-center border-b-1 border-transparent hover:border-light-2 px-3 cursor-pointer;

  &.selected {
    @apply border-light-4 hover:border-light-4;
  }
}
</style>