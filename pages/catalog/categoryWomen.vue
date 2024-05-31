<template>
  <title>Каталог товаров</title>
    <vHeader />
    <div class="catalog-page">
      <h1>Женская одежда</h1>
      <div class="products">
        <div class="product" v-for="product in products" :key="product.id">
          <NuxtLink :to="`product/${product.id}`">
            <img :src="product.image" :alt="product.name">
            <h2>{{ product.name }}</h2>
            <p>{{ product.price }} RUB</p>
            <button @click.prevent="addToCart(product)">В Корзину</button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import products from '@/api/products'

export default {
  data() {
    return {
      products: []
    }
  },
  mounted() {
    this.fetchWomenProducts()
  },
  methods: {
    async fetchWomenProducts() {
      const allProducts = await products;
      this.products = allProducts.filter(product => product.category === 'women');
    },
    addToCart(product) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []
      const existingItem = cartItems.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        cartItems.push({ ...product, quantity: 1 })
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    },
  }
}

  </script>
  
  <style scoped>
  .catalog-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
    background-color: #fff;
  }
  
  .products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .product {
    width: 50%;
    margin-bottom: 2rem;
  }
  
  .product img {
    width: 50%;
    height: auto;
  }
  
  .product h2 {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .product p {
    margin: 0;
  }
  </style>
  