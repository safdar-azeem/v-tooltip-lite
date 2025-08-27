<script setup lang="ts">
import { onMounted, onUnmounted, computed, Teleport } from 'vue'
import { usePopover } from '../composables/usePopover'
import { TooltTipProps } from '../types'
import '../css/style.css'

const props = withDefaults(defineProps<TooltTipProps>(), {
   placement: 'bottom-end',
   offset: () => [0, 8],
   trigger: 'hover',
   content: '',
   arrow: true,
   teleport: true,
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
      <span ref="triggerRef" class="tooltip-trigger" :class="triggerClass">
         <slot name="trigger" v-bind="{ isOpen }" />
      </span>
      <component :is="teleport ? Teleport : 'div'" v-if="isOpen" to="body">
         <div
            :style="styles"
            v-if="isOpen"
            ref="containerRef"
            class="tooltip-container tooltip-container--open"
            :class="className"
            role="tooltip"
            aria-hidden="true">
            <div class="tooltip-content">
               <slot v-bind="{ isOpen }">{{ content }}</slot>
            </div>
            <div v-if="arrow" :class="['tooltip-arrow', arrowClass]"></div>
         </div>
      </component>
   </div>
</template>
