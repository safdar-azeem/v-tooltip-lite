import { nextTick } from 'vue'
import { onClickOutside } from 'clickout-lite'
import type { Placement } from '@popperjs/core'
import { onMounted, onBeforeUnmount, ref, type Ref, watch } from 'vue'
import { createPopper, type Instance as PopperInstance } from '@popperjs/core'

interface PopoverOptions {
   onShow?: () => void
   onHide?: () => void
}

export function usePopover(
   placement: Placement,
   offset = [0, 8],
   triggerMode: 'hover' | 'click',
   options: PopoverOptions = {}
) {
   const triggerRef: Ref<HTMLElement | null> = ref(null)
   const containerRef: Ref<HTMLElement | null> = ref(null)
   const popperInstance: Ref<PopperInstance | null> = ref(null)
   const actualPlacement: Ref<Placement> = ref(placement)
   const isOpen = ref(false)
   let showTimeout: number | null = null
   let hideTimeout: number | null = null

   const clearTimeouts = () => {
      if (showTimeout) {
         clearTimeout(showTimeout)
         showTimeout = null
      }
      if (hideTimeout) {
         clearTimeout(hideTimeout)
         hideTimeout = null
      }
   }

   const initializePopper = async () => {
      if (triggerRef.value && containerRef.value) {
         popperInstance.value?.destroy()
         await nextTick()
         popperInstance.value = createPopper(triggerRef.value, containerRef.value, {
            placement: placement,
            strategy: 'absolute',
            modifiers: [
               {
                  name: 'offset',
                  options: {
                     offset: offset,
                  },
               },
               {
                  name: 'preventOverflow',
                  options: {
                     boundary: 'viewport',
                     padding: 8,
                  },
               },
               {
                  name: 'flip',
                  options: {
                     fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                  },
               },
               {
                  name: 'arrow',
                  options: {
                     element: '.tooltip-arrow',
                     padding: 8,
                  },
               },
               {
                  name: 'updateActualPlacement',
                  enabled: true,
                  phase: 'afterWrite',
                  fn({ state }) {
                     actualPlacement.value = state.placement
                  },
               },
            ],
         })
      }
   }

   const showTooltip = async () => {
      clearTimeouts()
      if (!isOpen.value) {
         showTimeout = window.setTimeout(
            async () => {
               isOpen.value = true
               await nextTick()
               if (containerRef.value) {
                  await initializePopper()
                  options.onShow?.()
               }
            },
            triggerMode === 'hover' ? 150 : 0
         )
      }
   }

   const hideTooltip = () => {
      clearTimeouts()
      if (isOpen.value) {
         hideTimeout = window.setTimeout(
            () => {
               isOpen.value = false
               popperInstance.value?.destroy()
               popperInstance.value = null
               options.onHide?.()
            },
            triggerMode === 'hover' ? 100 : 0
         )
      }
   }

   const toggleTooltip = () => {
      if (isOpen.value) {
         hideTooltip()
      } else {
         showTooltip()
      }
   }

   const updatePopper = () => {
      popperInstance.value?.forceUpdate()
   }

   const destroyPopper = () => {
      clearTimeouts()
      if (popperInstance.value) {
         popperInstance.value.destroy()
         popperInstance.value = null
      }
   }

   onMounted(async () => {
      await nextTick()

      if (triggerMode === 'click') {
         triggerRef.value?.addEventListener('click', toggleTooltip)
      }

      if (triggerMode === 'hover') {
         triggerRef.value?.addEventListener('mouseenter', showTooltip)
         triggerRef.value?.addEventListener('mouseleave', hideTooltip)
      }

      onClickOutside(containerRef, () => {
         if (isOpen.value && triggerMode === 'click') {
            hideTooltip()
         }
      })
   })

   onBeforeUnmount(() => {
      destroyPopper()
      if (triggerMode === 'click') {
         triggerRef.value?.removeEventListener('click', toggleTooltip)
      }
      if (triggerMode === 'hover') {
         triggerRef.value?.removeEventListener('mouseenter', showTooltip)
         triggerRef.value?.removeEventListener('mouseleave', hideTooltip)
      }
   })

   watch(
      () => placement,
      () => {
         if (isOpen.value) {
            initializePopper()
         }
      }
   )

   return {
      triggerRef,
      containerRef,
      popperInstance,
      actualPlacement,
      isOpen,
      initializePopper,
      updatePopper,
      destroyPopper,
      showTooltip,
      hideTooltip,
   }
}
