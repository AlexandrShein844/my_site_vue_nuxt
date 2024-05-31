<template>
  <title>Каталог товаров</title>
  <vHeader />
  <div class="catalog-page">
    <h1>Каталог товаров</h1>
    <div class="products">
      <div class="product" v-for="product in products" :key="product.id">
        <NuxtLink :to="`catalog/product/${product.id}`">
          <img :src="product.image" :alt="product.name">
          <h2>{{ product.name }}</h2>
          <p>{{ product.price }} RUB</p>
          <button @click.prevent="addToCart(product)">В корзину</button>
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
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.products = await products
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
  /* border: 2px solid #000000; */
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
