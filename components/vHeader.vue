<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-brand">
        <NuxtLink to="/" class="nav-logo">
          <img src="/assets/images/logo-site.png" alt="Logo">
        </NuxtLink>
      </div>
      <div class="nav-links">
        <div class="nav-item dropdown">
          <NuxtLink to="/catalog" class="nav-link dropdown-btn">Каталог</NuxtLink>
          <div class="dropdown-content">
            <NuxtLink to="/catalog/categoryWomen" class="dropdown-item">Женское</NuxtLink>
            <NuxtLink to="/catalog/categoryMan" class="dropdown-item">Мужское</NuxtLink>
            <NuxtLink to="/catalog/category3" class="dropdown-item">Другое</NuxtLink>
          </div>
        </div>
        <NuxtLink to="/about" class="nav-link">О Нас</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Контакты</NuxtLink>
        <NuxtLink to="/cart/cart" class="nav-link">
          <img src="/assets/images/basket.png" alt="Корзина">
          <span v-if="cartItems.length" class="nav-cart-count">{{ cartItemCount }}</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script>
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'

export default {
  setup() {
    const cartItems = useStorage('cartItems', ref([]))

    const cartItemCount = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
    })

    return {
      cartItems,
      cartItemCount,
    }
  },
}
</script>

<style scoped>
.header {
  max-width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #1d1c1c;
  color: #fff;
  display: flex;
  justify-content: center;
}

.nav {

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}

.nav-link {
  position: relative;
  top: -10px;
  color: #ffffffd5;
  text-decoration: none;
  margin: 0 1rem;
}

.nav-link img {
  position:relative;
  bottom: -10px;
}

.nav-link:hover {
  color: #fff;
  text-decoration: none;
  margin: 0 1rem;
}

.nav-logo img {
  max-height: 80px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  border-radius: 5px;
  display: none;
  position: absolute;
  left: -75px;
  background-color: #2e2c2c;
  min-width: 160px;
  box-shadow: 5px 10px 5px rgb(96, 96, 96);
}

.dropdown-content a {
  
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #272727;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
