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
        <div class="sidebar-item" :class="{ 'active': selectedCategory === 'another' }" @click="loadProducts('another')">
          Разное
        </div>
      </div>
      <div class="products">
        <div class="product" v-for="product in filteredProducts" :key="product.id">
          <NuxtLink :to="`catalog/product/${product.id}`" class="product-link">
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image">
            </div>
            <div class="product-details">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-price">{{ product.price }} RUB</p>
            </div>
          </NuxtLink>
          <button v-if="product.category === 'another'" :disabled="isAddingToCartId === product.id" @click="addToCart(product)" class="add-to-cart-button" :class="{ 'adding-to-cart': isAddingToCartId === product.id }">
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
    const productsData = ref([]) // новая переменная для хранения данных, полученных с сервера
    const products = computed(() => productsData.value) // теперь products будет вычисляемой переменной, которая будет возвращать массив товаров из productsData
    const isAddingToCartId = ref(null)
    const selectedCategory = ref('')
    const headerHeight = ref(0)

    // новая функция для загрузки товаров с сервера
    const loadProducts = async (category) => {
      const response = await axios.get(`https://6649e9874032b1331bef35a4.mockapi.io/api/products?category=${category}`)
      productsData.value = response.data
      selectedCategory.value = category
      pageTitle.value = getPageTitle(category)
    }

    onMounted(async () => {
      await loadProducts('') // теперь загружаем товары с сервера при загрузке страницы

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
      if (!category) return 'Все товары'
      if (category === 'man') return 'Мужские товары'
      if (category === 'woman') return 'Женские товары'
      if (category === 'another') return 'Разное'
      return ''
    }

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
          name: existingItem.name,
          quantity: existingItem.quantity,
          price: existingItem.price,
          image: existingItem.image,
          category: product.category
        })
      } else {
        // Если товара еще нет в корзине, добавляем его в корзину с количеством 1
        await axios.post('https://6649e9874032b1331bef35a4.mockapi.io/api/cart', {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          image: product.image,
          category: product.category
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
          image: product.image,
          category: product.category
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems))

      setTimeout(() => {
        isAddingToCartId.value = null
        window.location.reload()
      }, 1000)
    }

    return {
      products,
      addToCart,
      isAddingToCartId,
      selectedCategory,
      filteredProducts,
      headerHeight,
      pageTitle,
      loadProducts // добавляем новую функцию в возвращаемый объект
    }
  }
}
</script>

<style scoped>
.catalog-page {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa; /* Цвет фона каталога */
  padding: 20px;
  border-radius: 8px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333; /* Цвет заголовка */
}

.catalog-content {
  display: flex;
}

.sidebar {
  height: 100%; /* Заполняем высоту сайдбара на всю доступную область */
  overflow-y: auto;
  width: 200px;
  padding: 1rem;
  background-color: #fff; /* Цвет фона сайдбара */
  margin-right: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень для блока */
}

.sidebar-item {
  padding: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar-item:hover {
  background-color: #f1f1f1; /* Цвет фона при наведении на элемент */
}

.sidebar-item.active {
  background-color: #b5b5b5; /* Цвет активного элемента */
  color: #333;
}
.product-link{
  text-decoration: none;
}

.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Три колонки */
  gap: 1rem;
  overflow: hidden; /* Обрезаем контент внутри блока */
}

.product {
  width: 200px; /* Фиксированная ширина карточки */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column; /* Делаем карточку блочным элементом с вертикальным направлением */
}

.product:hover {
  transform: translateY(-5px); /* Легкое поднятие карточки при наведении */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease; /* Плавное изменение при наведении на изображение */
}

.product:hover .product-image {
  transform: scale(1.05); /* Увеличение изображения при наведении */
}

.product-details {
  padding: 1rem;
  flex-grow: 1; /* Занимаем всё доступное пространство внутри карточки */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Размещаем элементы внизу контейнера */
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-price {
  font-size: 1.1rem;
  color: #6c757d;
  margin-top: auto; /* Выравниваем цену внизу */
}

.add-to-cart-button {
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #393939;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.add-to-cart-button:hover {
  background-color: #171717; /* Изменение цвета кнопки при наведении */
}

.add-to-cart-button:disabled,
.add-to-cart-button.adding-to-cart {
  cursor: not-allowed;
  opacity: 0.7;
}

.adding-to-cart {
  animation: shake 0.5s ease-out both;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>

