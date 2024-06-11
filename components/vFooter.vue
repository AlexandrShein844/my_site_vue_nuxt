<template>
    <footer class="footer">
      <nav class="nav">
        <div class="nav-links">
          <NuxtLink to="/about" class="nav-link">О Нас</NuxtLink>
          <NuxtLink to="/contact" class="nav-link">Контакты</NuxtLink>
        </div>
      </nav>
    </footer>
  </template>
  
  <script>
  export default {
    // You can add your component's logic here if needed
  }
  </script>
  
  <style scoped lang="less">
  .footer {
    width: 100%;
    background-color: #1d1c1c;
    color: #fff;
    display: flex;
    padding: 1rem 0;
    margin: 0;
  }
  
  .nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
  }
  
  .nav-link {
    color: #ffffffd5;
    text-decoration: none;
    margin: 0 1rem;
  }
  
  .nav-link:hover {
    color: #fff;
    text-decoration: none;
    margin: 0 1rem;
  }
  </style>
  