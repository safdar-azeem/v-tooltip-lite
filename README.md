# Vue Tooltip | DropDown

A lightweight and customizable Vue 3 tooltip/dropdown component with support for hover and click triggers, customizable placement, offset, and arrow styles, featuring accessibility and responsive design.

## Features

-  **Multiple Trigger Modes**: Supports `hover` and `click` triggers for flexible interaction.
-  **Customizable Placement**: Position tooltips with 12 placement options (e.g., `top`, `bottom`, `left`, `right`, etc.).
-  **Responsive Design**: Adapts to various screen sizes with a clean, modern UI.
-  **Accessibility**: Includes ARIA attributes for enhanced usability.
-  **Customizable Styling**: Flexible CSS variables for background, text, border, shadow, and arrow styles.
-  **Performance Optimized**: Uses Vue 3 composition API for efficient rendering and positioning.
-  **TypeScript Support**: Fully typed with TypeScript for better developer experience.

## Demo

[Live Demo](https://v-tooltip-lite.vercel.app/)

## Installation

```bash
# npm
npm install v-tooltip-lite

# yarn
yarn add v-tooltip-lite

# pnpm
pnpm add v-tooltip-lite
```

## Usage

Below are examples demonstrating different configurations of the Vue Tooltip component.

### 1. Basic Hover Tooltip

A simple tooltip with hover trigger and default bottom placement.

```vue
<script setup>
import ToolTip from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
</script>

<template>
   <div>
      <h3>Basic Tooltip</h3>
      <ToolTip content="This is a tooltip">
         <template #trigger>
            <button>Hover Me</button>
         </template>
      </ToolTip>
   </div>
</template>
```

## 📁 Importing Styles

You must import the CSS styles:

```ts
import 'v-tooltip-lite/dist/style.css'
```

### 2. Click-Triggered Tooltip

A tooltip that appears on click and closes on another click.

```vue
<ToolTip content="Click again to close!" trigger="click" placement="top">
    <template #trigger>
      <button>Click Me</button>
    </template>
</ToolTip>
```

### 3. Tooltip Without Arrow

A tooltip without the arrow for a cleaner look.

```vue
<ToolTip content="No arrow tooltip" :arrow="false" placement="right">
      <template #trigger>
        <button>Hover Me</button>
      </template>
</ToolTip>
```

### 4. Custom Content Tooltip

A tooltip with custom HTML content.

```vue
<ToolTip placement="bottom">
    <template #trigger>
      <button>Custom Content</button>
    </template>
    <template #default>
      <div style="text-align: left">
          <h4>Custom Content</h4>
          <p style="margin-top: 4px; font-size: 0.7rem">
            You can place <code>HTML</code> here, including formatting.
          </p>
      </div>
    </template>
</ToolTip>
```

### 5. Long Text Tooltip

A tooltip with long text that wraps within the maximum width.

```vue
<ToolTip
   content="This is a very long tooltip text that will wrap and test the max width of the tooltip. Keep hovering to read all of it."
   placement="bottom">
      <template #trigger>
        <button>Hover Me</button>
      </template>
</ToolTip>
```

## Props

| Prop           | Type                     | Default        | Description                                                             |
| -------------- | ------------------------ | -------------- | ----------------------------------------------------------------------- |
| `content`      | `string`                 | `''`           | The tooltip content (used if no default slot is provided).              |
| `placement`    | `string`                 | `'bottom-end'` | Popper.js placement (e.g., `top`, `bottom`, `left`, `right`, etc.).     |
| `offset`       | `[number, number]`       | `[0, 8]`       | Offset for the tooltip from the trigger element `[skidding, distance]`. |
| `trigger`      | `'hover' \| 'click'`     | `'hover'`      | Trigger mode for showing/hiding the tooltip.                            |
| `arrow`        | `boolean`                | `true`         | Whether to display the tooltip arrow.                                   |
| `triggerClass` | `string`                 | `''`           | Class to be applied to the trigger element.                             |
| `styles`       | `Record<string, string>` | `{}`           | Custom styles for the tooltip container.                                |

## Events

| Event    | Description                               |
| -------- | ----------------------------------------- |
| `onShow` | Emitted when the tooltip becomes visible. |
| `onHide` | Emitted when the tooltip is hidden.       |

## Styling

Customize the appearance using the following CSS variables defined in `style.css`:

```css
:root {
   --tooltip-bg: #000000;
   --tooltip-text: #ffffff;
   --tooltip-border: rgba(255, 255, 255, 0.1);
   --tooltip-radius: 0.375em;
   --tooltip-shadow: 0 0.625em 1.5625em -0.3125em rgba(0, 0, 0, 0.1), 0 0.25em 0.375em -0.125em rgba(0, 0, 0, 0.05);
   --tooltip-arrow-size: 0.475em;
   --tooltip-z-index: 999989;
   --tooltip-font-size: 0.75em;
   --tooltip-line-height: 1.4;
   --tooltip-padding: 0.6em 0.5em;
   --tooltip-min-width: 3.125em;
}
```

## Author

[safdar-azeem](https://github.com/safdar-azeem)
