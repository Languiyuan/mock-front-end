<template>
  <div
    class="flex items-center justify-center w-full h-full bg-[url('@/assets/images/login_bg.svg')] bg-cover bg-no-repeat bg-[#eeeeee]"
  >
    <div
      class="relative box-border flex items-center justify-around w-[96.5%] h-[94%] bg-[rgb(255_255_255_/_80%)] px-[50px] py-0 rounded-[10px]"
    >
      <div class="w-[800px] mr-10 hidden xl:block">
        <img class="w-full h-full" src="@/assets/images/login_left.png" alt="" />
      </div>

      <div
        class="w-[420px] bg-[color: #ffffff] shadow-[rgb(0_0_0_/_10%)_0_2px_10px_2px] pt-[50px] pb-[45px] px-10 rounded-[10px]"
      >
        <div class="flex items-center justify-center mb-10">
          <img class="w-14 h-12" src="@/assets/logo.svg" alt="" />
          <h2 class="text-[42px] font-bold text-[#34495e] whitespace-nowrap m-0 pl-[25px] pr-0 py-0">Lan Mock</h2>
        </div>

        <LoginForm></LoginForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import LoginForm from './components/LoginForm.vue'
</script>
