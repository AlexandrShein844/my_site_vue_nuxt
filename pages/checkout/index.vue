<template>
  <title>Оформление заказа</title>
  <div class="order-page">
    <div class="order-container">
      <div class="order-steps-container">
        <div class="order-step" v-for="(step, index) in orderSteps" :key="index" :class="{ 'active-step': index === currentStep }">
          <p>{{ step }}</p>
        </div>
      </div>
      <div class="order-details-container">
        <div v-if="currentStep === 0">
          <label>
            Полное имя:
            <input v-model="orderData.fullName" type="text" placeholder="Введите ваше полное имя">
          </label>
          <button @click="nextStep">Продолжить</button>
        </div>
        <div v-else-if="currentStep === 1">
          <label>
            Полный адрес:
            <input v-model="orderData.fullAddress" type="text" placeholder="Введите ваш полный адрес">
          </label>
          <button @click="nextStep">Продолжить</button>
        </div>
        <div v-else-if="currentStep === 2">
          <label>
            Номер банковской карты:
            <input v-model="orderData.cardNumber" type="text" placeholder="Введите номер вашей банковской карты">
          </label>
          <label>
            Срок действия карты (ММ/ГГ):
            <input v-model="orderData.cardExpiry" type="text" placeholder="Введите срок действия вашей карты">
          </label>
          <label>
            CVV:
            <input v-model="orderData.cardCVV" type="text" placeholder="Введите CVV вашей карты">
          </label>
          <button @click="submitOrder">Оформить заказ</button>
        </div>
      </div>
      <div class="order-summary-container">
        <ul>
          <li v-for="(item, index) in cartItems" :key="index">
            {{ item.name }} - {{ item.price }} RUB
            <span class="item-quantity">x {{ item.quantity }}</span>
          </li>
        </ul>
        <hr>
        <p>Итоговая сумма к оплате: {{ totalPrice }} RUB</p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const orderSteps = ref(['Полное имя', 'Полный адрес', 'Банковская карта'])
    const currentStep = ref(0)
    const router = useRouter()

    const orderData = ref({
      fullName: '',
      fullAddress: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: ''
    })

    const nextStep = () => {
      if (currentStep.value < orderSteps.value.length - 1) {
        currentStep.value++
      }
    }

    const cartItems = ref([])
    const totalPrice = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    onMounted(async () => {
      // Получаем данные о товарах в корзине
      const response = await fetch('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const data = await response.json()
      cartItems.value = data
    })

    const clearCartOnServer = async () => {
      const response = await fetch('https://6649e9874032b1331bef35a4.mockapi.io/api/cart')
      const data = await response.json()

      // Удаляем каждый элемент из корзины
      for (const item of data) {
        await fetch(`https://6649e9874032b1331bef35a4.mockapi.io/api/cart/${item.id}`, {
          method: 'DELETE'
        })
      }
    }

    const submitOrder = async () => {
      // Добавляем данные о товарах и итоговую сумму к orderData
      orderData.value.items = cartItems.value
      orderData.value.totalPrice = totalPrice.value

      // Сохраняем orderData в localStorage
      localStorage.setItem('orderData', JSON.stringify(orderData.value))

      // Очищаем корзину в localStorage
      localStorage.removeItem('cartItems')
      cartItems.value = []

      // Очищаем корзину на сервере
      await clearCartOnServer()

      // Перенаправляем пользователя на страницу успешного заказа
      reloadPage()
      router.push('/success')
    }
    const reloadPage = () => {
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    return {
      orderSteps,
      currentStep,
      nextStep,
      orderData,
      cartItems,
      totalPrice,
      submitOrder
    }
  }
}
</script>





<style lang="less" scoped>
  .order-page {
    padding: 2rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ebebeb;
    font-family: Arial, sans-serif; /* Пример шрифта */
  }
  
  .order-container {
    width: 90%; /* Пример задания ширины */
    max-width: 1200px; /* Пример ограничения максимальной ширины */
    margin: 0 auto; /* Центрирование контейнера */
    padding: 5%;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Пример тени */
    border-radius: 10px; /* Пример закругления углов */
  }
  
  .order-steps-container {
    width: 20%;
    margin-right: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
  
    .order-step {
      width: 100%;
      padding: 1rem 0;
      border-bottom: 1px solid #ccc;
      text-align: center;
      cursor: pointer;
  
      &:hover {
        background-color: #f5f5f5;
      }
  
      &.active-step {
        background-color: #313131;
        color: #fff;
      }
    }
  }
  
  .order-details-container {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    label {
      display: block;
      margin-bottom: 1rem;
    }
  
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px; /* Пример изменения размера шрифта */
    }
  
    button {
      background-color: #313131;
      color: #fff;
      border: none;
      border-radius: 5px;
      width: 100%;
      height: 40px;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.3s ease-in-out;
  
      &:hover {
        background-color: #000000;
      }
    }
  }
  
  .order-summary-container {
    width: 40%;
    margin-left: 15%;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    ul {
      list-style-type: none;
      padding: 0;
      width: 100%;
  
      li {
        padding: 1rem 0;
        border-bottom: 1px solid #ccc;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
  
        .item-quantity {
          color: #666; /* Цвет количества товара */
          font-size: 14px; /* Размер шрифта количества */
        }
      }
    }
  
    hr {
      width: 80%;
      border-top: 1px solid #ccc;
      margin: 1rem 0;
    }
  }
</style>

  