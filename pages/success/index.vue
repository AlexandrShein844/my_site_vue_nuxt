<template>
    <title>Заказ успешно создан</title>
    <main class="success-page">
      <section class="message-container">
        <h1>Спасибо за ваш заказ!</h1>
        <p>Ваш заказ был успешно создан и скоро будет обработан.</p>
        <NuxtLink to="/" class="home-button">Вернуться на главную страницу</NuxtLink>
      </section>
    </main>
  </template>
  
  <style scoped>
  .success-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
    font-family: 'Arial', sans-serif;
  }
  
  .message-container {
    text-align: center;
    background-color: #ffffff;
    padding: 2rem 3rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .message-container h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .message-container p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
  }
  
  .home-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #ffcc00;
    color: #000;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .home-button:hover {
    background-color: #e6b800;
  }
  </style>
  