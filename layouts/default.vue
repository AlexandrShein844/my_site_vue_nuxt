<template>
  <div class="layout-default">
    <slot />
  </div>
</template>
  
  <style scoped>
  .layout-default {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1920px;
  }
  </style>