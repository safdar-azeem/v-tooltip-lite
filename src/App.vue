<script setup lang="ts">
import ToolTip from './components/ToolTip.vue'
</script>

<template>
   <div class="app">
      <ToolTip content="Tooltip on Top" placement="top">
         <template #trigger>
            <button>Top Placement</button>
         </template>
      </ToolTip>

      <ToolTip content="Tooltip on Bottom" placement="bottom">
         <template #trigger>
            <button>Bottom Placement</button>
         </template>
      </ToolTip>

      <ToolTip content="Tooltip on Left" placement="left">
         <template #trigger>
            <button>Left Placement</button>
         </template>
      </ToolTip>

      <ToolTip content="Tooltip on Right" placement="right">
         <template #trigger>
            <button>Right Placement</button>
         </template>
      </ToolTip>

      <ToolTip content="Click Trigger Tooltip" placement="top" trigger="click">
         <template #trigger>
            <button>Click Trigger</button>
         </template>
      </ToolTip>

      <ToolTip content="No Arrow Tooltip" placement="top" :arrow="false">
         <template #trigger>
            <button>No Arrow</button>
         </template>
      </ToolTip>

      <ToolTip placement="bottom">
         <template #trigger>
            <button>Custom Content</button>
         </template>
         <template #default>
            <div style="text-align: left">
               <h3>Custom Content</h3>
               <p style="margin-top: 4px; font-size: 0.7rem">
                  You can place <code>HTML</code> here, including formatting.
               </p>
            </div>
         </template>
      </ToolTip>

      <ToolTip
         content="This is a very long tooltip text that will wrap and test the max width of the tooltip. Keep hovering to read all of it."
         placement="bottom">
         <template #trigger>
            <button>Long Text</button>
         </template>
      </ToolTip>

      <ToolTip content="Click again to close me!" trigger="click" placement="right">
         <template #trigger>
            <button>Click Trigger</button>
         </template>
      </ToolTip>
   </div>
</template>

<style scoped>
button {
   padding: 0.5rem 1rem;
   background-color: #f3f4f6;
   border: 1px solid #d1d5db;
   border-radius: 0.375rem;
   cursor: pointer;
   transition: background-color 0.2s ease;
   font-size: 0.875rem;
   font-weight: 500;
   color: #111827;
}

button:hover {
   background-color: #e5e7eb;
}

body {
   font-family: system-ui, sans-serif;
   background-color: #f9fafb;
   color: #111827;
   margin: 0;
   padding: 2rem;
}

*,
*::before,
*::after {
   box-sizing: border-box;
   letter-spacing: -0.01px;
   margin: 0;
}

.app {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: 400px;
   margin: 50px auto;
}
</style>
