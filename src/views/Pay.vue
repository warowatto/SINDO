<template>
  <div style="width: 100%; height: 100%">
    <div id="contents">
      <div class="header">
        <router-link to="/bucket" class="back">
          <i class="material-icons">keyboard_backspace</i>
        </router-link>
        <router-link to="/" class="home">
          <i class="material-icons">home</i>
        </router-link>
      </div>
      <div class="sub order">
        <div class="sub_title">
          <h2>주문하기</h2>
          <p>선택하신 상품을 확인 후 결제를 진행 해 주세요</p>
          <span></span>
        </div>
        <div class="inner">
          <div class="order_list">
            <ul>
              <li v-for="(p, index) in $route.params.products" :key="index">
                <span class="eq">{{ p.machine.name }}</span>
                <span class="name">{{ p.product.name }}</span>
                <span class="amount">{{ p.count | numeral('0,0') }} 개</span>
                <span class="price">{{ p.count * p.product.price | numeral('0,0') }}원</span>
              </li>
            </ul>
          </div>
          <div class="last_price">
            <dl>
              <dt>최종결제금액</dt>
              <dd>
                <b>{{ total | numeral('0,0') }}</b> 원
              </dd>
            </dl>
          </div>
          <div class="credit">
            <p>
              <b>결제방법</b>을 선택해주세요
            </p>
            <div class="row">
              <div class="col-lg-6" @click="pay('card')">
                <dl data-toggle="modal" data-target="#card_modal" class="modal-on">
                  <dt>
                    <span>
                      <img src="@/assets/img/card_img.jpg" />
                    </span>
                  </dt>
                  <dd>카드결제</dd>
                </dl>
              </div>
              <div class="col-lg-6" @click="pay('cash')">
                <dl data-toggle="modal" data-target="#coin_modal" class="modal-on">
                  <dt>
                    <span>
                      <img src="@/assets/img/coin.png" />
                    </span>
                  </dt>
                  <dd>현금결제</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <!-- inner -->
      </div>
      <!-- order -->

      <div id="status-bar">
        <ul class="status-list">
          <li>인터넷</li>
          <li>터치</li>
        </ul>
        <div class="time">10:10</div>
      </div>
    </div>

    <b-modal
      ref="cardModal"
      size="lg"
      :centered="true"
      :hide-header="true"
      :hide-footer="true"
      dialog-class="credit_modal"
      :body-class="['credit_modal']"
      :no-close-on-backdrop="true"
    >
      <div class="inner">
        <h3>카드결제</h3>
        <div class="img">
          <img src="@/assets/img/card_img.jpg" />
        </div>
        <p>카드리더기에 카드를 투입 해 주세요</p>
        <div class="info">
          <dl>
            <dt>결제금액</dt>
            <dd>
              <b>{{ total | numeral('0,0') }}</b> 원
            </dd>
          </dl>
        </div>
      </div>
    </b-modal>

    <b-modal
      ref="cashModal"
      size="lg"
      :centered="true"
      :hide-header="true"
      :hide-footer="true"
      dialog-class="credit_modal"
      :body-class="['credit_modal']"
    >
      <div class="inner">
        <h3>현금결제</h3>
        <div class="img">
          <img src="@/assets/img/coin.gif" />
        </div>
        <p>결제금액만큼 현금을 투입해주세요</p>
        <div class="info">
          <dl>
            <dt>결제금액</dt>
            <dd>
              <b>{{ total | numeral('0,0') }}</b> 원
            </dd>
          </dl>
          <dl>
            <dt>투입된 금액</dt>
            <dd>
              <b>{{ amount | numeral('0,0') }}</b> 원
            </dd>
          </dl>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { of } from 'rxjs';
import { delay, map, filter, take, tap } from 'rxjs/operators';
import numeral from 'numeral';

export default {
  data() {
    return {
      amount: 0,
    };
  },
  computed: {
    total() {
      return this.$route.params.products
        .map((item) => {
          return item.count * item.product.price;
        })
        .reduce((acc, value) => acc + value, 0);
    },
  },
  mounted() {
    const self = this;
    this.serialport.messageEvent
      .pipe(
        filter(({ type }) => type === 'response'),
        filter(({ commend }) => commend.label === 'cash'),
        filter(({ data }) => data[0].amount),
        map(({ data }) => Number(data[0].amount)),
      )
      .subscribe((price) => {
        self.amount += price;
      });

    this.serialport.messageEvent
      .pipe(
        filter(({ type }) => type === 'response'),
        filter(({ commend }) => commend.label === 'cash'),
        filter(({ data }) => data[0].methodRunning),
        map(({ data }) => data),
        take(1),
      )
      .subscribe(
        () => {
          const returnPrice = Number(this.amount) - Number(this.total);
          self.$router.push({ name: 'finish', params: { products: self.$route.params.products, payType: 'cash', returnPrice } });
        },
        () => {},
      );
  },
  methods: {
    async pay(type) {
      const amount = this.total;

      type === 'card'
        ? this.$bvModal.msgBoxOk('현재 카드결제는 진행할 수 없습니다', {
            size: 'lg',
            centered: true,
            okTitle: '확인',
          })
        : this.$refs.cashModal.show();

      if (type !== 'cash') return;
      
      const products = this.$route.params.products;
      const requestData = products.map(({ count, machine, product }) => {
        return [
          `Q${numeral(machine.id).format('000')}`,
          `R${numeral(product.id).format('000')}`,
          `S${numeral(count).format('000')}`,
        ].join('/');
      }).join('&');

      const commend = `[q B T${numeral(amount).format('000000')}&${requestData}]`;
      // this.serialport.write(commend);

      const returnPrice = Number(8000) - Number(this.total);
      this.$router.push({ name: 'finish', params: { products: this.$route.params.products, payType: 'cash', returnPrice } });
    },
  },
};
</script>
