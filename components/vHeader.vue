<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-brand">
        <NuxtLink to="/" class="nav-logo">
          <img src="/assets/images/logo.png" alt="Logo">
        </NuxtLink>
      </div>
      <div class="nav-links">
        <div class="nav-item dropdown">
          <NuxtLink to="/catalog?category=" class="nav-link dropdown-btn">Каталог</NuxtLink>
          <div class="dropdown-content">
            <NuxtLink to="/catalog/categoryWoman" class="dropdown-item" @click="hideResultsImmediately">Женское</NuxtLink>
            <NuxtLink to="/catalog/categoryMan" class="dropdown-item" @click="hideResultsImmediately">Мужское</NuxtLink>
            <NuxtLink to="/catalog/categoryAnother" class="dropdown-item" @click="hideResultsImmediately">Другое</NuxtLink>
          </div>
        </div>
        <NuxtLink to="/about" class="nav-link" @click="hideResultsImmediately">О Нас</NuxtLink>
        <NuxtLink to="/contact" class="nav-link" @click="hideResultsImmediately">Контакты</NuxtLink>
        <NuxtLink to="/cart" class="nav-link cart-link" @click="hideResultsImmediately">
          <img src="/assets/images/basket.png" alt="Корзина">
          <span v-if="cartItemCount" class="nav-cart-count">{{ cartItemCount }}</span>
        </NuxtLink>
      </div>
      <div class="nav-search">
        <input v-model="searchQuery" placeholder="Поиск..." @focus="showResults = true" @input="handleInput">
        <div v-if="showResults" class="search-results">
          <div v-if="searchResults.length">
            <div v-for="result in searchResults" :key="result.id" class="search-result">
              <NuxtLink :to="`/catalog/product/${result.id}`" class="search-result-link" @click="hideResultsImmediately">
                {{ result.name }}
              </NuxtLink>
            </div>
          </div>
          <div v-else-if="searchQuery">
            <div class="search-result">
              По вашему запросу ничего не найдено
            </div>
          </div>
          <div v-else-if="errorMessage">
            <div class="search-result">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

export default {
  setup() {
    const cartItems = useStorage('cartItems', ref([]));

    const cartItemCount = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
    });

    const searchQuery = ref('');
    const searchResults = ref([]);
    const showResults = ref(false);
    const errorMessage = ref('');

    async function searchProducts() {
      if (!searchQuery.value) {
        searchResults.value = [];
        return;
      }

      try {
        const response = await fetch(`https://6649e9874032b1331bef35a4.mockapi.io/api/products?name=${searchQuery.value}`);
        if (!response.ok) {
          errorMessage.value = `HTTP error Status: ${response.status}`;
          searchResults.value = [];
          return;
        }
        searchResults.value = await response.json();
        errorMessage.value = '';
      } catch (error) {
        errorMessage.value = `Error: ${error.message}`;
        searchResults.value = [];
      }
    }

    function handleInput() {
      if (searchQuery.value) {
        searchProducts();
      } else {
        searchResults.value = [];
        errorMessage.value = '';
      }
    }

    watch(searchQuery, handleInput);

    function hideResults() {
      setTimeout(() => {
        showResults.value = false;
      }, 100);
    }

    function hideResultsImmediately() {
      showResults.value = false;
    }

    function handleClickOutside(event) {
      const searchInput = event.target.closest('.nav-search input');
      const searchResults = event.target.closest('.search-results');
      if (!searchInput && !searchResults) {
        hideResults();
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    watch(cartItems, () => {
      cartItemCount.value = cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
    }, { deep: true, immediate: true });

    return {
      cartItems,
      cartItemCount,
      searchQuery,
      searchResults,
      showResults,
      errorMessage,
      hideResultsImmediately
    }
  },
}
</script>

<style scoped>
.header {
  max-width: 100%;
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #1d1c1c;
  color: #fff;
  display: flex;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #ffffffd5;
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #fff;
}

.nav-logo img {
  max-height: 50px;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  border-radius: 5px;
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #2e2c2c;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: dropdownAnimation 0.3s ease-in-out;
}

.dropdown-content a {
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: #272727;
}

.dropdown:hover .dropdown-content {
  display: block;
}

@keyframes dropdownAnimation {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-search {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-search input {
  border: none;
  border-bottom: 2px solid #fff;
  background-color: transparent;
  color: #fff;
  padding: 5px;
  outline: none;
  width: 200px;
  transition: width 0.3s ease-in-out;
}

.nav-search input:focus {
  width: 300px;
  border-color: #ffcc00;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2e2c2c;
  width: 100%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.search-result {
  padding: 10px;
}

.search-result-link {
  color: #fff;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.search-result-link:hover {
  background-color: #272727;
}

.cart-link {
  position: relative;
}

.nav-cart-count {
  position: absolute;
  top: 15px;
  right: -10px;
  background-color: #ffcc00;
  color: #000;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}
</style>
