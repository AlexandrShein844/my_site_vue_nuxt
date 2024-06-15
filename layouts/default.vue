<template>
  <div class="layout-default">
    <slot />
  </div>
</template>
  
  <style scoped>
  .layout-default {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1920px;
  }
  </style>