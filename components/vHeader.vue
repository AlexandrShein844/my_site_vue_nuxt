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
          <NuxtLink to="/catalog?category=" class="nav-link dropdown-btn">Каталог</NuxtLink>
          <div class="dropdown-content">
            <NuxtLink to="/catalog/categoryWoman" class="dropdown-item">Женское</NuxtLink>
            <NuxtLink to="/catalog/categoryMan" class="dropdown-item">Мужское</NuxtLink>
            <NuxtLink to="/catalog/categoryAnother" class="dropdown-item">Другое</NuxtLink>
          </div>
        </div>
        <NuxtLink to="/about" class="nav-link">О Нас</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Контакты</NuxtLink>
        <NuxtLink to="/cart" class="nav-link">
          <img src="/assets/images/basket.png" alt="Корзина">
          <span v-if="cartItemCount" class="nav-cart-count">{{ cartItemCount }}</span>
        </NuxtLink>
      </div>
      <div class="nav-search">
        <input v-model="searchQuery" placeholder="Поиск..." @focus="showResults = true" @input="handleInput">
        <div v-if="showResults" class="search-results">
          <div v-if="searchResults.length">
            <div v-for="result in searchResults" :key="result.id" class="search-result">
              <NuxtLink :to="`/catalog/product/${result.id}`" class="search-result-link">
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
import { useStorage } from '@vueuse/core'
import { computed, ref, watch, onMounted } from 'vue'

// Добавление метода для получения данных из API
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

// Добавление метода для обновления данных в хранилище cartItems
function updateCartItems() {
  fetchData('https://6649e9874032b1331bef35a4.mockapi.io/api/cart').then(data => {
    cartItems.value = data;
  });
}

export default {
  setup() {
    const cartItems = useStorage('cartItems', ref([]));

    const cartItemCount = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
    });

    // Изменение метода setup() для получения данных из API и хранения их во внутреннем состоянии
    updateCartItems();

    // Добавление данных для поиска товара
    const searchQuery = ref('');
    const searchResults = ref([]);
    const showResults = ref(false);
    const errorMessage = ref('');

    // Метод для поиска товара
    async function searchProducts() {
      if (!searchQuery.value) {
        searchResults.value = [];
        return;
      }

      try {
        const response = await fetch(`https://6649e9874032b1331bef35a4.mockapi.io/api/products?name=${searchQuery.value}`);
        if (!response.ok) {
          errorMessage.value = `HTTP error! Status: ${response.status}`;
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

    // Метод для обработки ввода в поле для поиска
    function handleInput() {
      if (searchQuery.value) {
        searchProducts();
      } else {
        searchResults.value = [];
        errorMessage.value = '';
      }
    }

    // Вызов метода searchProducts() при изменении searchQuery
    watch(searchQuery, handleInput);

    // Метод для скрытия результатов поиска
    function hideResults() {
      setTimeout(() => {
        showResults.value = false;
      }, 100);
    }

    // Метод для обработки клика вне поля для ввода и списка результатов поиска
    function handleClickOutside(event) {
      const searchInput = event.target.closest('.nav-search input');
      const searchResults = event.target.closest('.search-results');
      if (!searchInput && !searchResults) {
        hideResults();
      }
    }

    // Добавление обработчика события click на весь документ после монтирования компонента
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      cartItems,
      cartItemCount,
      searchQuery,
      searchResults,
      showResults,
      errorMessage,
      updateCartItems, // Добавление метода updateCartItems
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
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
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
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2e2c2c;
  width: 100%;
  box-shadow: 5px 10px 5px rgb(96, 96, 96);
}

.search-result {
  padding: 10px;
}

.search-result-link {
  color: #fff;
  text-decoration: none;
}

.search-result-link:hover {
  text-decoration: underline;
}
</style>