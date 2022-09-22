<template>
  <teleport to="#app-modals">
    <cy-transition>
      <div
        v-if="visible"
        class="cy--modal"
        :class="rootClass"
        v-bind="attrs"
        @click="closeModal"
      >
        <div class="modal-wrapper">
          <cy-button-icon
            icon="jam-close-circle-f"
            icon-width="1.5rem"
            class="cy--modal--close-btn"
            @click.stop="closeModal"
          />
          <div class="modal-container" @click.stop>
            <div v-if="slots['title'] || title" class="pb-2 px-4">
              <slot name="title">
                <cy-icon-text :icon="titleIcon" text-color="dark-light">
                  {{ title }}
                </cy-icon-text>
              </slot>
            </div>
            <div class="p-4 pt-0 relative h-full overflow-y-auto overscroll-none">
              <slot />
            </div>
            <div v-if="footer" class="py-1.5 mx-4 bg-white flex justify-end space-x-2">
              <slot name="footer" :close-modal="closeModal">
                <slot name="footer-actions" />
                <cy-button-action icon="ic-round-close" @click="closeModal">
                  {{ t('global.close') }}
                </cy-button-action>
              </slot>
            </div>
          </div>
        </div>
        <div
          v-if="$slots['extra-content']"
          ref="extraContentElement"
          class="modal-extra-wrapper bg-opacity-100"
          :style="extraContentStyle"
        >
          <div class="modal-extra-container" @click.stop>
            <div class="modal-extra" @click="showExtraContent">
              <slot name="extra-content" />
            </div>
            <div class="absolute right-4 -bottom-16">
              <cy-button-circle
                v-show="extraContent.main"
                color="blue"
                icon="ep:arrow-right-bold"
                @click="hideExtraContent"
              />
            </div>
          </div>
        </div>
      </div>
    </cy-transition>
  </teleport>
</template>

<script lang="ts">
import { computed, CSSProperties, ref, Ref, useAttrs, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'

import { remToPixels } from '@/shared/utils/element'

import ToggleService from '@/setup/ToggleService'

export default {
  name: 'CyModal',
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
interface Props {
  visible: boolean;
  verticalPosition?: 'start' | 'center';
  width?: 'normal' | 'auto' | 'wide';
  footer?: boolean;
  title?: string;
  titleIcon?: string;
}
interface Emits {
  (evt: 'close'): void;
  (evt: 'update:visible', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  verticalPosition: 'center',
  width: 'normal',
  footer: false,
})
const emit = defineEmits<Emits>()

const attrs = useAttrs()
const slots = useSlots()

const rootClass = computed(() => {
  return {
    'items-start': props.verticalPosition === 'start',
    'items-center': props.verticalPosition === 'center',
    ['width-' + props.width]: true,
  }
})

const closeModal = () => {
  emit('update:visible', false)
  emit('close')
}

const { extraContent, toggle } = ToggleService({ extraContent: ['main'] as const })

const extraContentElement: Ref<HTMLElement | null> = ref(null)
const extraContentStyle = ref<CSSProperties>({})
const showExtraContent = () => {
  if (extraContentElement.value && !extraContent.main) {
    const pd = remToPixels(1)
    const ww = window.innerWidth
    const rect = extraContentElement.value.getBoundingClientRect()
    if (rect.width + 2 * pd > ww) {
      extraContentStyle.value = { left: '0' }
      toggle('extraContent/main', true)
      return
    }
    if (rect.right > ww - pd) {
      const base = ww <= remToPixels(32) ? '50% + 40vw' : '50% + 13rem'
      extraContentStyle.value = { left: `calc(${base} - ${rect.right - ww + pd}px)` }
      toggle('extraContent/main', true)
      return
    }
  }
}
const hideExtraContent = () => {
  if (extraContent.main) {
    toggle('extraContent/main', false)
    extraContentStyle.value = {}
  }
}

const { t } = useI18n()
</script>

<style lang="postcss" scoped>
.cy--modal {
  @apply fixed h-full w-full top-0 left-0 flex justify-center bg-black bg-opacity-15 z-100;

  & > .modal-wrapper {
    @apply relative inline-block mb-2 mt-2.5 mx-2 bg-opacity-100 max-w-full;

    height: calc(100% - 1.125rem);

    & > .modal-container {
      @apply w-full max-h-full pt-3 border-1 border-primary-30 bg-white flex flex-col;

      min-height: 10rem;
    }
  }

  &.width-normal > .modal-wrapper {
    width: 25rem;
  }
  &.width-wide > .modal-wrapper {
    width: 42.5rem;
  }
  &.width-auto > .modal-wrapper {
    width: auto;

    & > .modal-container {
      overflow: auto;
    }
  }
}

.modal-extra-wrapper {
  @apply absolute w-80 h-full max-w-full mx-2 my-4 duration-300 flex items-center;

  left: calc(50% + 13rem);

  @media screen and (max-width: 32rem) {
    left: calc(50% + 40vw);
  }
}

.modal-extra-container {
  @apply w-full relative flex flex-col;

  max-height: calc(100% - 12rem);
}

.modal-extra {
  @apply w-full h-full pr-2 overflow-y-auto overscroll-none;
}

.cy--modal--close-btn {
  position: absolute;
  top: -0.75rem;
  right: -0.8rem;
  z-index: 1;
  padding: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    width: 0.8rem;
    height: 0.8rem;
  }
}
</style>