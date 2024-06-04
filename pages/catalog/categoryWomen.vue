<template>
  <title>Женская одежда</title>
  <vHeader />
  <div class="catalog-page">
    <h1>Для Девушек</h1>
    <div class="products">
      <div class="product" v-for="product in products" :key="product.id">
        <NuxtLink :to="`product/${product.id}`">
          <img :src="product.image" :alt="product.name" class="product-image">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">{{ product.price }} RUB</p>
        </NuxtLink>
        <button
          :disabled="isAddingToCartId === product.id"
          @click="addToCart(product)"
          class="add-to-cart-button"
          :class="{ 'adding-to-cart': isAddingToCartId === product.id }"
        >
          {{ isAddingToCartId === product.id ? 'Добавление...' : 'В корзину' }}
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const products = ref([])
    const isAddingToCartId = ref(null)

    onMounted(async () => {
      const response = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/products')
      products.value = response.data
      products.value = products.value.filter(product => product.category === 'women')
    })

    const addToCart = async (product) => {
      isAddingToCartId.value = product.id

      // Отправляем запрос на MockAPI для получения данных о товарах в корзине
      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data

      // Проверяем, есть ли в корзине товар с идентичным product_id
      const existingItem = cartData.find((item) => item.product_id === product.id)

      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем его количество
        existingItem.quantity++
        // Отправляем запрос на MockAPI для обновления количества товара в корзине
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${existingItem.id}`, {
          product_id: existingItem.product_id,
          quantity: existingItem.quantity,
          price: existingItem.price,
          image: existingItem.image
        })
      } else {
        // Если товара еще нет в корзине, добавляем его в корзину с количеством 1
        const response = await axios.post('https://6649e9874032b1331bef35a4.mockapi.io/api/cart', {
          product_id: product.id,
          quantity: 1,
          price: product.price,
          image: product.image
        })
      }

      // Обновляем данные о товарах в корзине в localStorage
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
          image: product.image
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
      isAddingToCartId
    }
  }
}
</script>
  
<style scoped>
.catalog-page {
  max-width: 1200px;
  border-radius: 10px;
  margin: 0 auto;
  padding: 2rem 0;
  background-color: #ffffff;
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product {
  border: 2px solid #000000;
  width: 50%;
  margin-bottom: 5px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 8px;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
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
  padding: 2px 5px;
  margin-top: 5px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
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
</style>