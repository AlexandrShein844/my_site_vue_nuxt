<template>
  <title>Каталог товаров</title>
  <div class="catalog-page" :style="{ 'margin-top': headerHeight + 'px' }">
    <h1 class="page-title">{{ pageTitle }}</h1>
    <div class="catalog-content">
      <div class="sidebar">
        <div class="sidebar-item" :class="{ 'active': selectedCategory === '' }" @click="loadProducts('')">
          Все товары
        </div>
        <div class="sidebar-item" :class="{ 'active': selectedCategory === 'man' }" @click="loadProducts('man')">
          Мужские товары
        </div>
        <div class="sidebar-item" :class="{ 'active': selectedCategory === 'woman' }" @click="loadProducts('woman')">
          Женские товары
        </div>
        <div class="sidebar-item" :class="{ 'active': selectedCategory === 'another' }"
          @click="loadProducts('another')">
          Разное
        </div>
      </div>
      <div class="products">
        <div class="product" v-for="product in filteredProducts" :key="product.id">
          <NuxtLink :to="`product/${product.id}`">
            <img :src="product.image" :alt="product.name" class="product-image">
            <h2 class="product-name">{{ product.name }}</h2>
            <p class="product-price">{{ product.price }} RUB</p>
          </NuxtLink>
          <button v-if="product.category === 'another'" :disabled="isAddingToCartId === product.id"
            @click="addToCart(product)" class="add-to-cart-button"
            :class="{ 'adding-to-cart': isAddingToCartId === product.id }">
            {{ isAddingToCartId === product.id ? 'Добавление...' : 'В корзину' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, computed, nextTick } from 'vue'

export default {
  setup() {
    const productsData = ref([])
    const products = computed(() => productsData.value)
    const isAddingToCartId = ref(null)
    const selectedCategory = ref('man')
    const headerHeight = ref(0)

    const loadProducts = async (category) => {
      const response = await axios.get(`https://6649e9874032b1331bef35a4.mockapi.io/api/products?category=${category}`)
      productsData.value = response.data
      selectedCategory.value = category
    }

    onMounted(async () => {
      await loadProducts('man')
      await nextTick()
      headerHeight.value = document.querySelector('header').offsetHeight
    })

    const filteredProducts = computed(() => {
      if (!selectedCategory.value) {
        return products.value
      }
      return products.value.filter(product => product.category === selectedCategory.value)
    })

    const pageTitle = computed(() => {
      return getPageTitle(selectedCategory.value)
    })

    const getPageTitle = (category) => {
      if (!category) {
        return 'Все товары'
      }
      if (category === 'man') {
        return 'Мужские товары'
      }
      if (category === 'woman') {
        return 'Женские товары'
      }
      if (category === 'another') {
        return 'Разное'
      }
      return ''
    }

    const addToCart = async (product) => {
      isAddingToCartId.value = product.id
      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data
      const existingItem = cartData.find((item) => item.product_id === product.id)

      if (existingItem) {
        existingItem.quantity++
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${existingItem.id}`, {
          product_id: existingItem.product_id,
          name: existingItem.name,
          quantity: existingItem.quantity,
          price: existingItem.price,
          image: existingItem.image,
          category: product.category
        })
      } else {
        await axios.post('https://6649e9874032b1331bef35a4.mockapi.io/api/cart', {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          image: product.image,
          category: product.category
        })
      }

      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItems.findIndex((item) => item.id === product.id)
      if (index !== -1) {
        cartItems[index].quantity++
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems))

      setTimeout(() => {
        isAddingToCartId.value = null
      }, 1000)
    }

    return {
      products,
      addToCart,
      isAddingToCartId,
      selectedCategory,
      filteredProducts,
      pageTitle,
      headerHeight,
      loadProducts
    }
  }
}
</script>

<style scoped>
.catalog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ebebeb;
  box-sizing: border-box;
  border-radius: 8px;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.catalog-content {
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 1rem;
  background-color: #f5f5f5;
  margin-right: 1rem;
}

.sidebar-item {
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar-item:hover {
  background-color: #ddd;
}

.sidebar-item.active {
  background-color: #454444;
  color: #fff;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  flex-grow: 1;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.product:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-name {
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.product-price {
  margin: 0;
  font-size: 1.1rem;
  color: #1b1b1b;
}

.add-to-cart-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #454444;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-button:hover {
  background-color: #171717;
}

.add-to-cart-button:disabled,
.add-to-cart-button.adding-to-cart {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #505050;
}

.adding-to-cart {
  animation: shake 0.5s ease-out both;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }
}
</style>
