<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { usePopover } from '../composables/usePopover'
import { TooltTipProps } from '../types'
import '../css/style.css'

const props = withDefaults(defineProps<TooltTipProps>(), {
   placement: 'bottom-end',
   offset: () => [0, 8],
   trigger: 'hover',
   content: '',
   arrow: true,
})

const emit = defineEmits(['onShow', 'onHide'])

const { triggerRef, containerRef, actualPlacement, initializePopper, destroyPopper, isOpen } =
   usePopover(props.placement, props.offset, props.trigger, {
      onShow: () => emit('onShow'),
      onHide: () => emit('onHide'),
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

onMounted(() => {
   initializePopper()
})

onUnmounted(() => {
   destroyPopper()
})
</script>

<template>
   <div class="tooltip-wrapper">
      <span ref="triggerRef" class="tooltip-trigger">
         <slot name="trigger" />
      </span>
      <div
         v-if="isOpen"
         ref="containerRef"
         class="tooltip-container tooltip-container--open"
         role="tooltip"
         aria-hidden="true">
         <div class="tooltip-content">
            <slot>{{ content }}</slot>
         </div>
         <div v-if="arrow" :class="['tooltip-arrow', arrowClass]"></div>
      </div>
   </div>
</template>
