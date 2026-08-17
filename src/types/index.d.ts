import type { Placement } from '@popperjs/core'

export type TooltTipPlacement = Placement
export type TooltTipTrigger = 'hover' | 'click' | 'manual'
export type ToolTipTeleportTarget = string | HTMLElement
/**
 * Which element the popper anchors to.
 *  - 'trigger' (default) — the trigger element itself (one-to-one tooltip).
 *  - 'wrapper'           — the trigger's parent element. Useful for mega-menus
 *                          where a single wide panel should span the width of
 *                          the wrapper that contains several triggers.
 */
export type TooltTipReference = 'trigger' | 'wrapper'

export interface TooltTipProps {
   content?: string
   placement?: TooltTipPlacement
   offset?: [number, number]
   trigger?: TooltTipTrigger
   reference?: TooltTipReference
   arrow?: boolean
   triggerClass?: string
   className?: string
   contentClass?: string
   teleport?: boolean
   /** Destination used when teleport is enabled. Defaults to document.body. */
   teleportTarget?: ToolTipTeleportTarget
   styles?: Record<string, string>
   ignoreClickOutside?: string[]
   isOpen?: boolean
   keepAlive?: boolean
   menuId?: string
   disabled?: boolean
}
