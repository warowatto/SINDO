<template>
  <div id="contents">
    <div class="header">
      <a @click="$router.push({ name: 'home' })" class="back">
        <i class="material-icons">keyboard_backspace</i>
      </a>
      <router-link to="/" class="home">
        <i class="material-icons">home</i>
      </router-link>
    </div>

    <div class="sub phone">
      <div class="shape_bg"></div>

      <div class="number_form">
        <div class="top">
          <h2>휴대폰번호 입력</h2>
          <p>
            구매영수증을 받기 위한 휴대폰 번호를
            <br />입력 해 주세요
          </p>
          <div class="view">{{ printPhoneNumber }}</div>
        </div>
        <div class="bottom">
          <ul>
            <li v-for="(number, index) in 3" :key="number">
              <button
                v-for="row in 3"
                :key="row"
                @click="inputNumber(index * 3 + row)"
              >{{ index * 3 + row }}</button>
            </li>
            <li>
              <button @click="removeNumber(true)">BACK</button>
              <button @click="inputNumber(0)">0</button>
              <button @click="removeNumber(false)">DEL</button>
            </li>
          </ul>
        </div>
        <button class="complete" @click="submit">입력완료</button>
      </div>
    </div>
    <!-- phone -->

    <!-- <div id="status-bar">
      <ul class="status-list">
        <li>인터넷</li>
        <li>터치</li>
      </ul>
      <div class="time">10:10</div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "010"
    };
  },
  computed: {
    printPhoneNumber() {
      return this.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  },
  methods: {
    inputNumber(number) {
      if (this.phone.length === 11) return;
      this.phone = `${this.phone}${number}`;
    },

    removeNumber(all = false) {
      if (all) {
        this.phone = "010";
      } else if (!all && this.phone.length > 3) {
        const phone = this.phone.substring(0, this.phone.length - 1);
        this.phone = phone;
      }
    },

    submit() {
      const phone = this.printPhoneNumber;
      if (!phone.match(/^\d{3}-\d{3,4}-\d{4}$/)) {
        this.$bvModal.msgBoxOk("올바른 전화번호를 입력해 주세요", { size: 'lg', okTitle: '확인', centered: true });
        return;
      }

      this.login(this.printPhoneNumber);
      this.$router.push({ name: 'bucket' });
    },

    login(phone) {

    }
  }
};
</script>
