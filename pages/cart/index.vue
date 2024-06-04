<template>
  <title>Корзина</title>
  <div>
    <div class="cart-page">
      <div class="cart-container">
        <div class="cart-items-container">
          <h1>Корзина</h1>
          <div v-if="cartItems.length === 0">
            <p>Ваша корзина пуста</p>
          </div>
          <div v-else>
            <div class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
              <img class="cart-item__img" :src="item.product.image" :alt="item.product.name">
              <div class="cart-item-info">
                <h2>{{ item.product.name }}</h2>
                <p>{{ item.price }} RUB</p>
                <p v-if="item.product.category != 'another'">Размер: {{ cartItemSizes[index] }}</p>
                <div class="cart-item-counter">
                  <button @click.prevent="decrementQuantity(item)" class="counter-button" > - </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click.prevent="incrementQuantity(item)" class="counter-button"> + </button>
                  <img @click.prevent="deleteItem(item)" class="counter-button delete-button__img" src="/assets/images/delete-icon.png" alt="Удалить">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-total" v-if="cartItems.length > 0">
          <p>Общая стоимость: </p>
          <p>{{ totalPrice }} RUB</p>
          <button @click="placeOrder">Оформить заказ</button>
          <NuxtLink to="/checkout" class="dropdown-item">заказек</NuxtLink>
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
      // Отправляем запрос на MockAPI для получения данных о товарах
      const responseProducts = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/products')
      products.value = responseProducts.data

      // Отправляем запрос на MockAPI для получения данных о товарах в корзине
      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data

      // Сравниваем product_id в запросе GET /api/cart и id в запросе GET /api/products
      // и добавляем найденные товары в массив cartItems
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

    const addToCart = async (product, selectedSize) => {
      isAddingToCartId.value = product.id

      // Отправляем запрос на MockAPI для получения данных о товарах в корзине
      const responseCart = await axios.get('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const cartData = responseCart.data

      // Проверяем, есть ли в корзине товар с идентичным product_id и размером
      const existingItem = cartData.find((item) => item.product_id === product.id && item.size === selectedSize)

      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем его количество
        existingItem.quantity++
        // Отправляем запрос на MockAPI для обновления количества товара в корзине
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${existingItem.id}`, {
          product_id: existingItem.product_id,
          quantity: existingItem.quantity,
          price: existingItem.price,
          size: selectedSize,
          category: existingItem.category // Добавлено здесь
        })

        // Добавляем выбранный размер в массив cartItemSizes
        const index = cartItems.value.findIndex((item) => item.product_id === product.id)
        if (index !== -1) {
          cartItemSizes.value[index] = selectedSize
        } else {
          cartItemSizes.value.push(selectedSize)
        }
      } else {
        // Если товара еще нет в корзине, добавляем его в корзину с количеством 1 и размером
        const response = await axios.post('https://6649e9874032b1331bef35a4.mockapi.io/api/cart', {
          product_id: product.id,
          quantity: 1,
          price: product.price,
          size: selectedSize,
          category: product.category // Добавлено здесь
        })

        // Добавляем выбранный размер в массив cartItemSizes
        const index = cartItems.value.findIndex((item) => item.product_id === product.id)
        if (index !== -1) {
          cartItemSizes.value[index] = selectedSize
        } else {
          cartItemSizes.value.push(selectedSize)
        }
      }

      // Обновляем данные о товарах в корзине в localStorage
      const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItemsData.findIndex((item) => item.id === product.id && item.size === selectedSize)
      if (index !== -1) {
        cartItemsData[index].quantity++
      } else {
        cartItemsData.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          size: selectedSize,
          category: product.category // Добавлено здесь
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData))

      setTimeout(() => {
        isAddingToCartId.value = null
      }, 1000)
    }

    const incrementQuantity = async (item) => {
      item.quantity++
      const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
      const index = cartItemsData.findIndex((i) => i.id === item.id)
      cartItemsData[index] = item
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData))

      // Отправляем запрос на MockAPI для обновления количества товара в корзине
      await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`, {
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        category: item.category // Добавлено здесь
      })

      // Обновляем выбранный размер в массиве cartItemSizes
      index = cartItems.value.findIndex((i) => i.id === item.id)
      cartItemSizes.value[index] = item.size // Добавлено здесь
    }

    const decrementQuantity = async (item) => {
      if (item.quantity > 1) {
        item.quantity--
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItemsData.findIndex((i) => i.id === item.id)
        cartItemsData[index] = item
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData))
        // Отправляем запрос на MockAPI для обновления количества товара в корзине
        await axios.put(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`, {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          category: item.category
        })

        // Обновляем выбранный размер в массиве cartItemSizes
         index = cartItems.value.findIndex((i) => i.id === item.id)
        if (index !== -1) {
          cartItemSizes.value[index] = item.size // Добавлено здесь
        }
      } else {
        const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || []
        const index = cartItemsData.findIndex((i) => i.id === item.id)
        cartItemsData.splice(index, 1)
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData))
        axios.delete(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`)
        cartItems.value = cartItems.value.filter((i) => i.id !== item.id)

        // Удаляем выбранный размер из массива cartItemSizes
        index = cartItems.value.findIndex((i) => i.id === item.id)
        if (index !== -1) {
          cartItemSizes.value.splice(index, 1) // Добавлено здесь
        }
      }
    }

    const deleteItem = async (item) => {
      item.quantity = 0;
      const cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || [];
      const index = cartItemsData.findIndex((i) => i.id === item.id);
      cartItemsData.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
      await axios.delete(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`);
      cartItems.value = cartItems.value.filter((i) => i.id !== item.id);

      // Удаляем выбранный размер из массива cartItemSizes
      index = cartItems.value.findIndex((i) => i.id === item.id)
      if (index !== -1) {
        cartItemSizes.value.splice(index, 1) // Добавлено здесь
      }
    }

    const totalPrice = computed(() => {
      // Вычисляем итоговую сумму на основе цен товаров в массиве cartItems
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    const placeOrder = async () => {
      // Отправляем запрос на MockAPI для очистки корзины
      await axios.delete('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      // Обнуляем массив cartItems
      cartItems.value = []
      // Удаляем данные о товарах в корзине из localStorage
      localStorage.removeItem('cartItems')

      // Обнуляем массив cartItemSizes
      cartItemSizes.value = [] // Добавлено здесь
    }

    return {
      products,
      cartItems,
      cartItemSizes, // Добавлено здесь
      addToCart,
      incrementQuantity,
      decrementQuantity,
      deleteItem,
      totalPrice,
      placeOrder,
    }
  },
}
</script>

<style lang="less" scoped>

.cart-page {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-container {
  width: 80%;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
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
}

.cart-item {
  margin-bottom: 2rem;
  border-bottom:2px solid #000000 ;
  display: flex;
  &__img {
  width: 20%;
  height: auto;
  margin-right: 1rem;
}
}

/* .cart-item img {
  width: 20%;
  height: auto;
  margin-right: 1rem;
}  */

.cart-item-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-counter {
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
  transition: all 0.3s ease-in-out;
}

button:hover {
  background-color: #b05353;
}

.cart-total button {
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

.cart-total button:hover {
  background-color: #000000;
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

.counter-button:active {
  background-color: #ccc;
}

.delete-button {
  margin-left: 1rem;
}
</style>
