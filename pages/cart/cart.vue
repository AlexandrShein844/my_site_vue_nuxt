<template>
  <title>Корзина</title>
  <div>
    <vHeader />
    <div class="cart-page">
      <div class="cart-container">
        <div class="cart-items">
          <h1>Корзина</h1>
          <div v-if="cartItems.length === 0">
            <p>Ваша корзина пуста</p>
          </div>
          <div v-else>
            <div class="cart-item" v-for="item in cartItems" :key="item.id">
              <h2>{{ item.name }}</h2>
              <p>{{ item.price }} RUB</p>
              <div class="quantity-buttons">
                <button @click="decrementQuantity(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="incrementQuantity(item)">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-total" v-if="cartItems.length > 0">
          <p>Общая стоимость: </p>
          <p>{{ totalPrice }} RUB</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  setup() {
    const cartItems = ref([])

    const fetchCartItems = () => {
      cartItems.value = JSON.parse(localStorage.getItem('cartItems')) || []
    }

    onMounted(() => {
      fetchCartItems()
    })

    const incrementQuantity = (item) => {
      item.quantity++
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItems.findIndex((i) => i.id === item.id)
      cartItems[index] = item
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      fetchCartItems()
    }

    const decrementQuantity = (item) => {
      if (item.quantity > 1) {
        item.quantity--
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItems.findIndex((i) => i.id === item.id)
        cartItems[index] = item
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        cartItems.value.splice(index, 1, item)
      } else if (item.quantity === 1) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItems.findIndex((i) => i.id === item.id)
        cartItems.splice(index, 1)
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        fetchCartItems()
      }
    }

    const totalPrice = computed(() => {
      return cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
    })

    return {
      cartItems,
      fetchCartItems,
      incrementQuantity,
      decrementQuantity,
      totalPrice,
    }
  },
}
</script>

<style scoped>

.cart-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cart-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  padding: 2rem 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-items {
  width: 70%;
}

.cart-total {
  width: 30%;
  font-weight: bold;
  margin-top: 1rem;
}

.cart-item {
  margin-bottom: 1rem;
}

.quantity-buttons {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.quantity-buttons button {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin: 0 5px;
}

.quantity-buttons span {
  margin: 0 5px;
}
</style>
