<script setup lang="ts">
import { onMounted, onUnmounted, computed, Teleport, watch } from 'vue'
import { usePopover } from '../composables/usePopover'
import { TooltTipProps } from '../types'
import '../css/style.css'

const props = withDefaults(defineProps<TooltTipProps>(), {
   placement: 'bottom-end',
   menuId: '',
   offset: () => [0, 8],
   trigger: 'hover',
   content: '',
   arrow: true,
   teleport: true,
   ignoreClickOutside: () => [],
   isOpen: undefined,
   keepAlive: false,
})

const emit = defineEmits(['onShow', 'onHide', 'update:isOpen'])

const {
   triggerRef,
   containerRef,
   actualPlacement,
   initializePopper,
   destroyPopper,
   isOpen,
   showTooltip,
   hideTooltip,
} = usePopover(props.placement, props.offset, props.trigger, {
   onShow: () => emit('onShow'),
   onHide: () => emit('onHide'),
   ignoreClickOutside: props.ignoreClickOutside,
})

const arrowClass = computed(() => {
   if (!props.arrow) return ''
   const placement = actualPlacement.value
   return placement.includes('top')
      ? 'tooltip-arrow--bottom'
      : placement.includes('bottom')
        ? 'tooltip-arrow--top'
        : placement.includes('left')
          ? 'tooltip-arrow--right'
          : placement.includes('right')
            ? 'tooltip-arrow--left'
            : 'tooltip-arrow--top'
})

watch(
   () => props.isOpen,
   (shouldBeOpen) => {
      if (shouldBeOpen === undefined) return
      if (shouldBeOpen && !isOpen.value) {
         showTooltip()
      } else if (!shouldBeOpen && isOpen.value) {
         hideTooltip()
      }
   },
   { immediate: true }
)

watch(isOpen, (val) => {
   if (val !== props.isOpen) {
      emit('update:isOpen', val)
   }
})

onMounted(() => {
   initializePopper()
})

onUnmounted(() => {
   destroyPopper()
})
</script>

<template>
   <div class="tooltip-wrapper">
      <span ref="triggerRef" class="tooltip-trigger" :class="triggerClass">
         <slot name="trigger" v-bind="{ isOpen }" />
      </span>
      <component :is="teleport ? Teleport : 'div'" v-if="isOpen || keepAlive" to="body">
         <div
            v-show="isOpen"
            :style="styles"
            :id="menuId"
            ref="containerRef"
            class="tooltip-container"
            :class="[className, isOpen ? 'tooltip-container--open' : '']"
            role="tooltip"
            aria-hidden="true">
            <div class="tooltip-content" :class="contentClass">
               <slot v-bind="{ isOpen }">{{ content }}</slot>
            </div>
            <div v-if="arrow" :class="['tooltip-arrow', arrowClass]"></div>
         </div>
      </component>
   </div>
</template>
