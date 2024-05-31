<template>
  <title>{{product.name}}</title>
  <vHeader/>
    <div class="product-page">
      <h1>{{ product.name }}</h1>
      <img :src="product.image" :alt="product.name">
      <p>{{ product.description }}</p>
      <p>{{ product.price }} RUB</p>
      <button @click.prevent="addToCart(product)">Купить</button>
    </div>
  </template>
  
  <script>
  import products from '@/api/products'
  
  export default {
    data() {
      return {
        product: {}
      }
    },
    mounted() {
      const productId = this.$route.params.id;
      const allProducts = products; 
      this.product = allProducts.find((item) => item.id == productId);
    },
    methods: {
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
  .product-page {
    max-width: 800px;
    background-color: #ffffff;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .product-page img {
    width: 100%;
    height: auto;
  }
  </style>