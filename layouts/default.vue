<template>
  <div class="layout-default">
    <slot />
  </div>
</template>
  
  <style scoped>
  .layout-default {
    box-sizing: border-box;
    /*position: relative;*/
  }
  /* .default::before {
    content: 'layouts/default.vue';
    position: absolute;
    top: 2px;
    left: 5px;
    color: #68b538;
    font-family: monospace;
  } */
  </style>