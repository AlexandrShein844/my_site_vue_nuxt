<template>
  <title>{{ product.name }}</title>
  <div class="product-page">
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image">
    </div>
    <div class="product-info-container">
      <h1 class="product-name">{{ product.name }}</h1>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-price"><strong>{{ product.price }} RUB</strong></p>
      <div v-if="product.category != 'another'" class="product-size-buttons">
        <button v-for="size in product.sizes" :key="size" @click="selectedSize = size"
          :class="{ 'size-button-selected': selectedSize === size }" :disabled="isAddingToCartId === product.id">
          {{ size }}
        </button>
      </div>
      <button :disabled="isAddingToCartId === product.id || !selectedSize && product.category != 'another'"
        @click="addToCart(product)" class="add-to-cart-button"
        :class="{ 'adding-to-cart': isAddingToCartId === product.id }">
        {{ isAddingToCartId === product.id ? 'Добавление...' : 'Добавить в корзину' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const product = ref({})
    const isAddingToCartId = ref(null)
    const selectedSize = ref(null)

    onMounted(async () => {
      const productId = parseInt(window.location.pathname.split('/')[3])
      const response = await axios.get(`https://6649e9874032b1331bef35a4.mockapi.io/api/products/${productId}`)
      product.value = response.data
      console.log(product)
    })

    const addToCart = async (product) => {
      isAddingToCartId.value = product.id

      // Отправляем запрос на MockAPI для получения данных о товарах в корзине
      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data

      // Проверяем, есть ли в корзине товар с идентичным product_id и размером
      let existingItem = null
      if (product.category !== 'another') {
        existingItem = cartData.find((item) => item.product_id === product.id && item.size === selectedSize.value)
      } else {
        existingItem = cartData.find((item) => item.product_id === product.id)
      }

      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем его количество
        existingItem.quantity++
        // Отправляем запрос на MockAPI для обновления количества товара в корзине
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${existingItem.id}`, {
          product_id: existingItem.product_id,
          quantity: existingItem.quantity,
          price: existingItem.price,
          image: existingItem.image,
          name: existingItem.name,
          ...(product.category !== 'another' && { size: selectedSize.value }),
          category: existingItem.category
        })
      } else {
        // Если товара еще нет в корзине, добавляем его в корзину с количеством 1 и размером
        const response = await axios.post('https://6649e9874032b1331bef35a4.mockapi.io/api/cart', {
          product_id: product.id,
          quantity: 1,
          price: product.price,
          image: product.image,
          name: product.name,
          ...(product.category !== 'another' && { size: selectedSize.value }),
          category: product.category
        })
      }

      // Обновляем данные о товарах в корзине в localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
      let index = null
      if (product.category !== 'another') {
        index = cartItems.findIndex((item) => item.id === product.id && item.size === selectedSize.value)
      } else {
        index = cartItems.findIndex((item) => item.id === product.id)
      }
      if (index !== -1) {
        cartItems[index].quantity++
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          ...(product.category !== 'another' && { size: selectedSize.value }),
          category: product.category
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems))

      setTimeout(() => {
        isAddingToCartId.value = null
      }, 1000)
    }

    return {
      product,
      addToCart,
      isAddingToCartId,
      selectedSize
    }
  }
}
</script>

<style lang="less" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.product-page {
  max-width: 1200px;
  padding: 50px;
  display: flex;
  flex-direction: row;
  background-color: #ebebeb;

  .product-image-container {
    justify-content: flex-end;
    margin-right: 2rem;

    .product-image {
      width: 100%;
      height: auto;
      border-radius: 5px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
  }

  .product-info-container {
    text-align: right;
    flex: 1;
    gap: 12px;
    display: flex;
    flex-direction: column;

    .product-name {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
    }

    .product-description {
      font-size: 20px;
      margin-bottom: 5px;
      color: #666;
    }

    .product-price {
      font-size: 20px;
      margin-bottom: 10px;
      color: #333;
      font-weight: bold;
    }

    .product-size-buttons {
      margin-bottom: 10px;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;

      .size-button {
        display: inline-block;
        padding: 5px 10px;
        margin-right: 5px;
        margin-bottom: 5px;
        font-size: 15px;
        font-weight: bold;
        color: #fff;
        background-color: #333;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #555;
        }

        &:disabled,
        &.adding-to-cart {
          cursor: not-allowed;
          opacity: 0.5;
          background-color: #555;
        }
      }

      .size-button-selected {
        background-color: #555;
      }
    }

    .add-to-cart-button {
      display: inline-block;
      padding: 5px 10px;
      margin: 5px 0px 0px 80px;
      font-size: 15px;
      font-weight: bold;
      color: #fff;
      background-color: #333;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: #555;
      }

      &:disabled,
      &.adding-to-cart {
        cursor: not-allowed;
        opacity: 0.5;
        background-color: #555;
      }
    }
  }
}
</style>
