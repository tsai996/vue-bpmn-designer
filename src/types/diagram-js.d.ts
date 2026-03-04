declare module 'diagram-js/lib/features/popup-menu/PopupMenuProvider' {
  import type {
    PopupMenuEntryAction,
    PopupMenuHeaderEntryAction,
  } from 'diagram-js/lib/features/popup-menu/PopupMenuProvider'

  interface MenuEntryGroup {
    id: string
    name: string
  }

  interface HeaderEntryGroup extends MenuEntryGroup {
    entries?: PopupMenuHeaderEntry[]
  }

  export type PopupMenuHeaderEntry = {
    action: PopupMenuHeaderEntryAction
    active?: boolean
    className: string
    group?: string | HeaderEntryGroup
    id: string
    imageUrl?: string
    imageHtml?: string
    label?: string
    title: string
  }

  export interface PopupMenuEntry {
    action: PopupMenuEntryAction
    className?: string
    title?: string
    name?: string
    group?: string | MenuEntryGroup
    documentationRef?: string
    description?: string
    imageUrl?: string
    imageHtml?: string
    label: string
  }

  export type PopupMenuEntries = Record<string, PopupMenuEntry>
  export type PopupMenuHeaderEntries = PopupMenuHeaderEntry[]
}
