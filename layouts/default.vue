<template>
    <div class="default">
      <slot />
    </div>
  </template>
  
  <style scoped>
  .default {
    padding: 1rem;
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