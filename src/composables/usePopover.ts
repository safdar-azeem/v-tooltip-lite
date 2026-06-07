import { nextTick } from 'vue'
import { onClickOutside } from 'clickout-lite'
import type { Placement } from '@popperjs/core'
import { onMounted, onBeforeUnmount, ref, type Ref, watch } from 'vue'
import { createPopper, type Instance as PopperInstance } from '@popperjs/core'
import type { TooltTipReference, TooltTipTrigger } from '../types'

interface PopoverOptions {
   onShow?: () => void
   onHide?: () => void
   ignoreClickOutside?: string[]
   disabled?: boolean
   reference?: TooltTipReference
   keepAlive?: boolean
}

export function usePopover(
   placement: Placement,
   offset = [0, 8],
   triggerMode: TooltTipTrigger,
   options: PopoverOptions = {}
) {
   const triggerRef: Ref<HTMLElement | null> = ref(null)
   const containerRef: Ref<HTMLElement | null> = ref(null)
   const popperInstance: Ref<PopperInstance | null> = ref(null)
   const actualPlacement: Ref<Placement> = ref(placement)
   const isOpen = ref(false)
   const isHovering = ref(false)
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

   /**
    * Resolve the element the popper should anchor to.
    *  - 'wrapper' (when configured) → the trigger's parent element.
    *  - otherwise                    → the trigger element itself.
    */
   const getReferenceElement = (): HTMLElement | null => {
      if (options.reference === 'wrapper') {
         const parent = triggerRef.value?.parentElement
         if (parent) return parent
      }
      return triggerRef.value
   }

   const createPopperInstance = async () => {
      const referenceEl = getReferenceElement()
      if (!referenceEl || !containerRef.value) return

      if (popperInstance.value) {
         popperInstance.value.destroy()
         popperInstance.value = null
      }

      const modifiers: any[] = [
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
            fn({ state }: any) {
               actualPlacement.value = state.placement
            },
         },
      ]

      // When anchored to a wrapper, the popper should match the wrapper's
      // width so mega-menu panels can span the full container. We do this
      // via popper's `sameWidth` custom modifier using `applyStyles` phase.
      if (options.reference === 'wrapper') {
         modifiers.push({
            name: 'sameWidth',
            enabled: true,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn: ({ state }: any) => {
               state.styles.popper.width = `${state.rects.reference.width}px`
            },
            effect: ({ state }: any) => {
               state.elements.popper.style.width = `${state.elements.reference.getBoundingClientRect().width}px`
            },
         })
      }

      popperInstance.value = createPopper(referenceEl, containerRef.value, {
         placement: placement,
         strategy: 'absolute',
         modifiers,
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
      if (options.disabled) return
      if (triggerMode === 'manual') {
         // Manual mode: just open without any event listeners bound.
         clearTimeouts()
         isOpen.value = true
         await nextTick()
         await createPopperInstance()
         options.onShow?.()
         setTimeout(() => {
            popperInstance.value?.forceUpdate()
         }, 0)
         return
      }
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
      if (triggerMode === 'manual') {
         isOpen.value = false
         options.onHide?.()
         if (popperInstance.value) {
            popperInstance.value.destroy()
            popperInstance.value = null
         }
         return
      }
      if (isOpen.value) {
         hideTimeout = window.setTimeout(
            () => {
               if (options.keepAlive) return
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
      isHovering.value = true
      if (triggerMode === 'hover') showTooltip()
   }

   const handleMouseLeave = () => {
      isHovering.value = false
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
         if (isOpen.value && (triggerMode === 'click' || triggerMode === 'manual')) {
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

   watch(
      () => options.keepAlive,
      (isKeepAlive) => {
         if (!isKeepAlive && triggerMode === 'hover' && !isHovering.value && isOpen.value) {
            hideTooltip()
         }
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
   } as any
}
