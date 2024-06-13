<template>
  <title>Корзина</title>
  <div>
    <div class="cart-page">
      <div class="cart-container">
        <div class="cart-items-container">
          <h1 class="page-title">Корзина</h1>
          <div v-if="cartItems.length === 0">
            <p class="empty-cart">Ваша корзина пуста</p>
          </div>
          <div v-else>
            <div class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
              <img class="cart-item__img" :src="item.product.image" :alt="item.product.name">
              <div class="cart-item-info">
                <h2 class="product-name">{{ item.product.name }}</h2>
                <p class="product-price">{{ item.price }} RUB</p>
                <p v-if="item.product.category != 'another'">Размер: {{ cartItemSizes[index] }}</p>
                <div class="cart-item-counter">
                  <button @click.prevent="decrementQuantity(item)" class="counter-button"> - </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click.prevent="incrementQuantity(item)" class="counter-button"> + </button>
                  <img @click.prevent="deleteItem(item)" class="counter-button delete-button__img" src="/assets/images/delete-icon.png" alt="Удалить">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-total" v-if="cartItems.length > 0">
          <p class="total-label">Общая стоимость:</p>
          <p class="total-price">{{ totalPrice }} RUB</p>
          <button @click="placeOrder" class="place-order-button">Оформить заказ</button>
          <NuxtLink to="/checkout" class="checkout-link">Перейти к оформлению</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

export default {
  setup() {
    const products = ref([])
    const cartItems = ref([])
    const cartItemSizes = ref([])

    onMounted(async () => {
      const responseProducts = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/products')
      products.value = responseProducts.data

      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data

      cartData.forEach((item) => {
        const product = products.value.find((p) => p.id === item.product_id)
        if (product) {
          cartItems.value.push({
            id: item.id,
            product_id: item.product_id,
            product,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            category: item.category
          })
          cartItemSizes.value.push(item.size) 
        }
      })
    })

    const incrementQuantity = async (item) => {
      item.quantity++
      const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItemsData.findIndex((i) => i.id === item.id)
      cartItemsData[index] = item
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData))

      await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`, {
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        category: item.category
      })

      const idx = cartItems.value.findIndex((i) => i.id === item.id)
      cartItemSizes.value[idx] = item.size
    }

    const decrementQuantity = async (item) => {
      if (item.quantity > 1) {
        item.quantity--
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItemsData.findIndex((i) => i.id === item.id)
        cartItemsData[index] = item
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData))
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`, {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          category: item.category
        })

        const idx = cartItems.value.findIndex((i) => i.id === item.id)
        cartItemSizes.value[idx] = item.size
      } else {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItemsData.findIndex((i) => i.id === item.id)
        cartItemsData.splice(index, 1)
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData))
        axios.delete(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`)
        cartItems.value = cartItems.value.filter((i) => i.id !== item.id)

        const idx = cartItems.value.findIndex((i) => i.id === item.id)
        if (idx !== -1) {
          cartItemSizes.value.splice(idx, 1)
        }
      }
    }

    const deleteItem = async (item) => {
      const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItemsData.findIndex((i) => i.id === item.id)
      cartItemsData.splice(index, 1)
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData))
      await axios.delete(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`)
      cartItems.value = cartItems.value.filter((i) => i.id !== item.id)

      const idx = cartItems.value.findIndex((i) => i.id === item.id)
      if (idx !== -1) {
        cartItemSizes.value.splice(idx, 1)
      }
    }

    const totalPrice = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    const placeOrder = async () => {
      await axios.delete('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      cartItems.value = []
      localStorage.removeItem('cartItems')
      cartItemSizes.value = []
    }

    return {
      products,
      cartItems,
      cartItemSizes,
      incrementQuantity,
      decrementQuantity,
      deleteItem,
      totalPrice,
      placeOrder
    }
  },
}
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ebebeb;
}

.cart-container {
  width: 80%;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  box-sizing: border-box;
}

.cart-items-container {
  width: 70%;
}

.cart-total {
  width: 25%;
  font-weight: bold;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.cart-item {
  margin-bottom: 2rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  transition: box-shadow 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-item__img {
  width: 20%;
  height: auto;
  border-radius: 8px;
  margin-right: 1rem;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
  color: #1b1b1b;
  margin-bottom: 0.5rem;
}

.cart-item-counter {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.counter-button {
  background-color: #333;
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  height: 30px;
  margin: 0 0.5rem;
  transition: background-color 0.3s ease;
  width: 30px;
}

.counter-button:hover {
  background-color: #000;
}

.delete-button__img {
  cursor: pointer;
  margin-left: 1rem;
}

.total-label {
  font-size: 1.25rem;
  color: #333;
}

.total-price {
  font-size: 1.5rem;
  color: #1b1b1b;
  margin-top: 0.5rem;
}

.place-order-button {
  background-color: #313131;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease-in-out;
}

.place-order-button:hover {
  background-color: #000;
}

.checkout-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #313131;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.checkout-link:hover {
  color: #000;
}
</style>
