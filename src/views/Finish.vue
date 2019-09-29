<template>
  <div id="contents">
    <div class="sub complete">
      <div class="complete_title">
        <span class="icon">
          <p>
            <img src="@/assets/img/auto.png" />
          </p>
        </span>
        <span class="title">결제가 완료되었습니다</span>
        <span class="des">
          선택하신 자판기에서 구매하신
          <br />상품을 찾아가주세요
        </span>
      </div>
      <div class="inner">
        <div class="order_list">
          <ul>
            <li v-for="(p, index) in $route.params.products" :key="index">
              <span class="eq">{{ p.machine.name }}</span>
              <span class="name">{{ p.product.name }}</span>
              <span class="amount">{{ p.count | numeral('0,0') }}개</span>
              <span class="price">{{ p.count * p.product.price | numeral('0,0') }}원</span>
            </li>
          </ul>
        </div>
        <div class="credit_info">
          <dl>
            <dt>결제방법</dt>
            <dd>{{ this.$route.params.payType === 'card' ? '카드결제' : '현금결제' }}</dd>
          </dl>
          <dl>
            <dt>결제금액</dt>
            <dd>
              <b>{{ total | numeral('0,0') }}</b> 원
            </dd>
          </dl>
          <dl>
            <dt>반환금액</dt>
            <dd>
              <b>{{ this.$route.params.returnPrice | numeral('0,0') }}</b> 원
            </dd>
          </dl>
        </div>

        <div class="bottom_btns">
          <router-link to="/">
            처음으로 돌아가기
            <i class="material-icons">keyboard_arrow_right</i>
          </router-link>
          <p>
            <b id="count">{{ count }}</b>초 후 메인페이지로 돌아갑니다.
          </p>
        </div>
      </div>
      <!-- inner -->
    </div>
    <!-- conplete -->
  </div>
</template>

<script>
import { interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export default {
  data() {
    return {
      count: 10,
      event: {},
    };
  },
  mounted() {
    const self = this;
    this.event = interval(1000).pipe(
      filter(i => self.count > 0),
      map(i => {
        self.count -= 1;
        return self.count;
      }),
      filter(i => i === 0)
    ).subscribe(
      () => { self.$router.push({ name: 'home' }) },
      console.log
    );
  },
  beforeDestroy() {
    this.event.unsubscribe();
  },
  computed: {
    total() {
      return this.$route.params.products.map(({ count, product }) => {
        return count * product.price;
      }).reduce((acc, value) => acc + value, 0);
    }
  }
};
</script>
