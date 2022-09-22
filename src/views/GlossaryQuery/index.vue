<template>
  <AppLayoutMain class="py-2">
    <div ref="topElement"></div>
    <div class="divide-y divide-light">
      <GlossaryTagItem v-for="tag in currentItems" :key="tag.name" :tag="tag" />
    </div>
    <div class="mt-3">
      <cy-pagination
        v-model:value="page"
        :max-page="maxPage"
        @changed="pageChanged"
      />
    </div>
    <AppLayoutBottom>
      <template #default>
        <div class="flex items-center w-full">
          <cy-icon-text icon="ic-outline-search" />
          <input
            v-model="searchText"
            type="text"
            class="border-0 p-1 ml-2 inline-block w-full bg-transparent"
            :placeholder="t('global.search')"
          />
        </div>
      </template>
    </AppLayoutBottom>
  </AppLayoutMain>
</template>

<script lang="ts">
export default {
  name: 'GlossaryQuery',
}
</script>

<script lang="ts" setup>
import { computed, nextTick, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Grimoire from '@/shared/Grimoire'

import PageControl from '@/setup/PageControl'

import AppLayoutMain from '@/components/app-layout/app-layout-main.vue'
import AppLayoutBottom from '@/components/app-layout/app-layout-bottom.vue'

import GlossaryTagItem from './glossary-tag-item.vue'

const { t } = useI18n()

const allTags = Grimoire.Glossary.tags

const searchText = ref('')

const currentTags = computed(() => {
  const text = searchText.value.toLowerCase()
  return allTags.filter(tag => {
    return tag.name.toLowerCase().includes(text) ||
      tag.rows.some(row => row.value.some(item => item.toLowerCase().includes(text)))
  })
})

const { currentItems, page, maxPage } = PageControl({
  items: currentTags,
  step: 30,
})

const topElement: Ref<HTMLElement | null> = ref(null)
const pageChanged = async () => {
  await nextTick()
  topElement.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>