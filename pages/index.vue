<template>
  <title>Главная</title>
  <main class="main">
    <section class="hero-section">
      <h1 class="hero-title">Добро пожаловать в наш интернет-магазин!</h1>
      <NuxtLink to="/catalog">
        <MainBanner class="main-banner"/>
      </NuxtLink>
    </section>
    <section class="banner-section">
      <div class="image-container">
        <NuxtLink to="/catalog/categoryMan" class="dropdown-item">
          <img src="/assets/images/for_man.png" alt="banner-Men">
          <div class="banner-overlay">
            <h2>Мужская Коллекция</h2>
            <p>Откройте для себя стиль и комфорт</p>
            <button class="cta-button">Купить сейчас</button>
          </div>
        </NuxtLink>
      </div>
      <div class="image-container">
        <NuxtLink to="/catalog/categoryWoman" class="dropdown-item">
          <img src="/assets/images/for_woman.png" alt="banner-Woman">
          <div class="banner-overlay">
            <h2>Женская Коллекция</h2>
            <p>Найдите свой идеальный образ</p>
            <button class="cta-button">Купить сейчас</button>
          </div>
        </NuxtLink>
      </div>
    </section>
    <section class="features">
      <div class="feature">
        <h3>Бесплатная доставка</h3>
        <p>На все заказы от 5000 рублей</p>
      </div>
      <div class="feature">
        <h3>Возврат без проблем</h3>
        <p>30 дней на возврат товара</p>
      </div>
      <div class="feature">
        <h3>Круглосуточная поддержка</h3>
        <p>Наши специалисты готовы помочь вам 24/7</p>
      </div>
    </section>
  </main>
</template>

<style>
  body {
    background-image: url(assets/images/бэк.png);
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }
</style>

<style scoped>
.main {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  margin-top: 60px;
}

.hero-section {
  position: relative;
  text-align: center;
  color: #fff;
}

.hero-title {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.main-banner {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.banner-section {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.image-container {
  position: relative;
  flex: 1;
  margin: 0 0.5rem;
  overflow: hidden;
  border-radius: 10px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover img {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .banner-overlay {
  opacity: 1;
}

.banner-overlay h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.banner-overlay p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.cta-button {
  background-color: #ffcc00;
  color: #000;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #e6b800;
}

.features {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  padding: 3rem 1rem;
  margin-top: 2rem;
  border-radius: 10px;
}

.feature {
  flex: 1;
  text-align: center;
  margin: 0 0.5rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.feature p {
  font-size: 1rem;
  color: #666;
}
</style>
