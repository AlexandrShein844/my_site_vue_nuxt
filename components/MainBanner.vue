<template>
  <section class="hero" @mouseover="isHovered = true" @mouseleave="isHovered = false">
    <NuxtLink to="/catalog">
      <img src="/assets/images/banner.jpg" alt="Hero Image" class="hero-image" :class="{ 'zoomed': isHovered }">
      <h1 class="hero-title" :class="{ 'visible': isHovered }">Добро пожаловать в наш интернет-магазин!</h1>
      <p class="hero-subtitle" :class="{ 'visible': isHovered }">Здесь вы можете ознакомиться со всеми товарами</p>
    </NuxtLink>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 800px;
  background-color: #333; /* Цвет фона, если изображение не загрузится */
  overflow: hidden; /* Прячем лишние части изображения, если они есть */
  border-radius: 10px; /* Закругляем углы */
}

.hero-title,
.hero-subtitle {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 3rem;
  text-align: center;
  z-index: 10; /* Помещаем текст над изображением */
  opacity: 0; /* Начальное скрытие текста */
  transition: opacity 0.3s ease, transform 0.3s ease; /* Плавное появление текста */
}

.hero-subtitle {
  font-size: 1.5rem;
  top: 60%; /* Смещаем подзаголовок ниже заголовка */
}

.visible {
  opacity: 1; /* Показываем текст при наведении */
  transform: translate(-50%, -50%) scale(1.1); /* Увеличиваем текст и немного смещаем при наведении */
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 1; /* Помещаем изображение под текстом */
  border: 2px solid #fff;
  border-radius: 10px; /* Закругляем углы */
  transition: transform 0.3s ease; /* Плавное изменение масштаба */
}

.zoomed {
  transform: scale(1.05); /* Увеличение картинки при наведении */
}

.hero:hover .hero-title,
.hero:hover .hero-subtitle {
  opacity: 1; /* Появление текста при наведении на .hero */
}
</style>

<script>
export default {
  data() {
    return {
      isHovered: false
    };
  }
};
</script>
