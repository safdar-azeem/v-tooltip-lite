import { nextTick } from 'vue'
import { onClickOutside } from 'clickout-lite'
import type { Placement } from '@popperjs/core'
import { onMounted, onBeforeUnmount, ref, type Ref, watch } from 'vue'
import { createPopper, type Instance as PopperInstance } from '@popperjs/core'

interface PopoverOptions {
   onShow?: () => void
   onHide?: () => void
   ignoreClickOutside?: string[]
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

   const createPopperInstance = async () => {
      if (!triggerRef.value || !containerRef.value) return

      if (popperInstance.value) {
         popperInstance.value.destroy()
         popperInstance.value = null
      }

      popperInstance.value = createPopper(triggerRef.value, containerRef.value, {
         placement: placement,
         strategy: 'absolute',
         modifiers: [
            {
               name: 'offset',
               options: { offset: offset },
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

   const initializePopper = async () => {
      if (!triggerRef.value || !containerRef.value) return

      if (popperInstance.value) {
         await nextTick()
         popperInstance.value.forceUpdate()
         return
      }

      await nextTick()
      await createPopperInstance()
   }

   const focusFirstItemInContainer = () => {
      if (!containerRef.value) return
      const focusable = containerRef.value.querySelector<HTMLElement>(
         '[tabindex="0"], [role="menu"], input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable) {
         focusable.focus({ preventScroll: true })
      }
   }

   const showTooltip = async () => {
      clearTimeouts()
      if (isOpen.value) {
         await nextTick()
         popperInstance.value?.forceUpdate()
         return
      }

      showTimeout = window.setTimeout(
         async () => {
            isOpen.value = true
            await nextTick()

            if (containerRef.value) {
               await createPopperInstance()
               options.onShow?.()
               setTimeout(() => {
                  popperInstance.value?.forceUpdate()
                  focusFirstItemInContainer()
               }, 0)
            }
         },
         triggerMode === 'hover' ? 150 : 0
      )
   }

   const hideTooltip = () => {
      clearTimeouts()
      if (isOpen.value) {
         hideTimeout = window.setTimeout(
            () => {
               isOpen.value = false
               options.onHide?.()
               if (popperInstance.value) {
                  popperInstance.value.destroy()
                  popperInstance.value = null
               }
            },
            triggerMode === 'hover' ? 30 : 0
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
      popperInstance.value?.update()
   }

   const destroyPopper = () => {
      clearTimeouts()
      if (popperInstance.value) {
         popperInstance.value.destroy()
         popperInstance.value = null
      }
   }

   const handleMouseEnter = () => {
      if (triggerMode === 'hover') showTooltip()
   }

   const handleMouseLeave = () => {
      if (triggerMode === 'hover') hideTooltip()
   }

   const handleTriggerClick = () => {
      if (triggerMode === 'hover') hideTooltip()
   }

   const shouldIgnoreClick = (target: HTMLElement): boolean => {
      if (triggerRef.value && (target === triggerRef.value || triggerRef.value.contains(target))) {
         return true
      }

      const ignores = options.ignoreClickOutside
      if (!ignores || ignores.length === 0) return false

      // Ensure target is an Element so .closest() resolves properly
      const el = target.nodeType === 3 ? target.parentElement : target
      if (!el) return false

      return ignores.some((selector) => {
         if (selector.startsWith('#')) {
            const id = selector.substring(1)
            // Even if the DOM node was just detached during a synchronous close call,
            // its internal parentNode hierarchy holds true, so .closest() will safely
            // identify the ghost `#id` container and rightfully ignore it.
            return el.id === id || el.closest(`#${CSS.escape(id)}`) !== null
         } else if (selector.startsWith('.')) {
            const className = selector.substring(1)
            return el.classList.contains(className) || el.closest(`.${CSS.escape(className)}`) !== null
         }
         return el.matches(selector) || el.closest(selector) !== null
      })
   }

   onMounted(async () => {
      await nextTick()

      if (triggerMode === 'click') {
         triggerRef.value?.addEventListener('click', toggleTooltip)
      }

      if (triggerMode === 'hover') {
         triggerRef.value?.addEventListener('mouseenter', handleMouseEnter)
         triggerRef.value?.addEventListener('mouseleave', handleMouseLeave)
         triggerRef.value?.addEventListener('click', handleTriggerClick)
      }

      onClickOutside(containerRef, (event) => {
         if (isOpen.value && triggerMode === 'click') {
            const target = event.target as HTMLElement
            if (!shouldIgnoreClick(target)) {
               hideTooltip()
            }
         }
      })
   })

   onBeforeUnmount(() => {
      destroyPopper()
      if (triggerMode === 'click') {
         triggerRef.value?.removeEventListener('click', toggleTooltip)
      }
      if (triggerMode === 'hover') {
         triggerRef.value?.removeEventListener('mouseenter', handleMouseEnter)
         triggerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
         triggerRef.value?.removeEventListener('click', handleTriggerClick)
      }
   })

   watch(
      () => placement,
      () => {
         if (isOpen.value) initializePopper()
      }
   )

   watch(isOpen, (isNowOpen) => {
      if (triggerMode !== 'hover') return
      nextTick(() => {
         if (isNowOpen && containerRef.value) {
            containerRef.value.addEventListener('mouseenter', handleMouseEnter)
            containerRef.value.addEventListener('mouseleave', handleMouseLeave)
         }
      })
   })

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
