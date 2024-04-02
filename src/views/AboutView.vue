<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div class="test">
      <div class="w-10 h-10 bg-black"></div>
      <div class="box2 w-10 h-10 bg-white"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.test {
  display: flex;
  align-items: center;
  .box2 {
    background-color: red;
  }
}
</style>
