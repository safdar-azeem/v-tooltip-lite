import type { Placement } from '@popperjs/core'

export type TooltTipPlacement = Placement

export interface TooltTipProps {
   content?: string
   placement?: TooltTipPlacement
   offset?: [number, number]
   trigger?: 'hover' | 'click'
   arrow?: boolean
   triggerClass?: string
   styles?: Record<string, string>
}
