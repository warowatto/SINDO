<template>
  <div id="contents">
    <div class="main">
      <a href="#">
        <div class="logo">
          <span class="logo1">PAYOT</span>
          <span class="logo2">TNS</span>
        </div>
        <div class="title">
          <img src="@/assets/img/title.png" />
          <p class="text1">vending machine system</p>
          <p class="text2">편리한 자동판매기 시스템</p>
        </div>
        <div class="bottom" @click="$router.push({ name: 'bucket' })">
          <img src="@/assets/img/touch.png" />
          <p>화면을 터치해주세요</p>
        </div>
      </a>
    </div>
    <!-- main -->
  </div>
</template>

<script>
export default {};
</script>
