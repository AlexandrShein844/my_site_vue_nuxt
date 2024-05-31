<template>
  <title>Главная</title>
  <vHeader />
  <main class="main">
    <NuxtLink to="/catalog">
      <MainBanner/>
    </NuxtLink>
    <section class="images">
      <div class="image-container">
        <NuxtLink to="/catalog/categoryMan" class="dropdown-item"><img src="/assets/images/custom.png" alt="banner-Men"></NuxtLink>
      </div>
      <div class="image-container">
        <NuxtLink to="/catalog/categoryWomen" class="dropdown-item"><img src="/assets/images/banner-woman.png" alt="banner-Woman"></NuxtLink>
      </div>
    </section>
  </main>
</template>
<style>
body {
  background-image:url(assets/images/цепи_простые.png);
}
</style>
<style scoped>

.main {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem 0;
  margin-top: 60px; /* Add top margin to push down the main section */
}

.images {
  display: flex;
  justify-content: space-between;
}

.image-container {
  border: 2px solid #000000;
  flex: 1;
  margin-right: 1rem;
}

.image-container:last-child {
  margin-right: 0;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta-button {
  background-color: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
}

.features {
  background-color: #cecece;
  display: flex;
  justify-content: space-between;
  padding: 3rem;
}

.feature {
  max-height: auto;
  flex: 1;
  text-align: center;
}
</style>
