<script setup lang="ts">
import ToolTip from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
</script>

<template>
   <div class="app">
      <div class="header">
         <h1>Vue Tooltip Lite</h1>
         <a
            href="https://github.com/safdar-azeem/v-toolTip-lite"
            target="_blank"
            aria-label="GitHub Repository">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               width="28"
               height="28"
               fill="currentColor">
               <path
                  d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.41 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.69-3.87-1.54-3.87-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.11-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.18a11.16 11.16 0 0 1 5.83 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.65.24 2.87.12 3.17.74.81 1.19 1.85 1.19 3.11 0 4.43-2.69 5.4-5.25 5.68.42.36.78 1.1.78 2.23v3.3c0 .31.2.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
            </svg>
         </a>
      </div>

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

.header {
   display: flex;
   gap: 0.75rem;
   margin-top: 3rem;
   margin-bottom: 1rem;
}

.header h1 {
   font-size: 1.75rem;
   font-weight: 700;
}

.header a {
   color: #111827;
   text-decoration: none;
   transition: opacity 0.2s ease;
}

.header a:hover {
   opacity: 0.7;
}
</style>
