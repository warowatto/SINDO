<template>
  <div id="contents">
    <div class="header">
      <router-link to="/home" class="back">
        <i class="material-icons">keyboard_backspace</i>
      </router-link>
      <router-link to="/home" class="home">
        <i class="material-icons">home</i>
      </router-link>
    </div>
    <div class="sub product">
      <div class="inner">
        <div class="sub_title">
          <h2>상품선택</h2>
          <p>자판기에 있는 상품을 선택 해 주세요</p>
          <span></span>
        </div>
        <div class="list">
          <div class="machine">
            <ul>
              <li
                :class="{on: _.eq(selectedMachine, machine) }"
                v-for="(machine, index) in machines"
                :key="index"
                @click="selectedMachine = machine"
              >
                <strong>{{ index + 1 | numeral('00') }}</strong>
                <span>자판기</span>
              </li>
            </ul>
          </div>
          <div class="items">
            <div class="row">
              <a
                class="col-md-4"
                v-for="(product, index) in selectedMachine.products"
                :key="index"
                @click="product.max !== 0 ? appendProduct(selectedMachine, product) : null"
              >
                <dl :class="{ no: product.max === 0 }">
                  <dt>
                    <img :src="product.image" />
                    <span class="number">{{ product.max | numeral('0,0') }}</span>
                  </dt>
                  <dd>{{ product.price | numeral('0,0') }}원</dd>
                  <dd class="black" v-if="product.max === 0">품절</dd>
                </dl>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="basket">
        <div class="inner">
          <div class="basket_list">
            <ul>
              <li v-for="(select, index) in selectedProducts" :key="index">
                <div class="name">
                  <span>{{ select.machine.name }}</span>
                  {{ select.product.name }}
                </div>
                <div class="amount">
                  <span>
                    <a @click="select.count += select.count >= select.product.max ? 0 : 1">+</a>
                    <input type="text" :value="select.count" />
                    <a @click="select.count -= select.count > 1 ? 1 : 0">-</a>
                  </span>
                </div>
                <div class="price">{{ select.product.price * select.count | numeral('0,0') }} 원</div>
                <div class="close">
                  <a href="#" @click="removeBucketProduct(index)">
                    <i class="material-icons">close</i>
                  </a>
                </div>
              </li>

              <li class="no-data" v-if="selectedProducts.length === 0">
                <div>상품을 선택 해 주세요</div>
              </li>
            </ul>
            <div class="last">
              <span>최종결제금액</span>
              <strong>{{ totalAmount | numeral('0,0') }} 원</strong>
            </div>
          </div>
          <div class="basket_btns">
            <a href="#" class="cancle" @click="removeBucketProduct(-1)">모두취소</a>
            <a href="#" class="order" @click="submit">결제하기</a>
          </div>
        </div>
      </div>
    </div>
    <!-- product -->
  </div>
</template>

<script>
import { times, findIndex, eq, chain } from 'lodash';
import numeral from 'numeral';
import { take } from 'rxjs/operators';

export default {
  data() {
    return {
      selectedMachine: {},
      machines: [{
        id: 1,
        name: '1번 자판기',
        products: [],
      }],
      selectedProducts: [],
    };
  },
  async mounted() {
    this.selectedMachine = this.machines[0];

    // if (await !this.deviceConnectState()) return;
    const { data } = await this.healthCheck();
    const findMachines = chain(data)
      .groupBy('machine')
      .map((machine, index) => {
        return {
          id: Number(index),
          name: `${Number(index)} 자판기`,
          products: machine.map(({ Product, productStock }) => {
            return {
              id: Product,
              name: '사이다',
              image: 'img/p01.png',
              max: productStock,
              price: 1000,
            };
          }),
        };
      })
      .value();
    this.machines = findMachines;
    this.selectedMachine = findMachines[0];
  },
  computed: {
    totalAmount() {
      return this.selectedProducts
        .map(({ count, product }) => {
          return product.price * count;
        })
        .reduce((acc, value) => acc + value, 0);
    },
  },
  methods: {
    appendProduct(machine, product) {
      const findProductBy = findIndex(this.selectedProducts, ({ machine: m, product: p }) => m.id === machine.id && p.id === product.id);

      if (findProductBy === -1) {
        this.selectedProducts.push({ machine, product, count: 1 });
      } else {
        const nowCount = this.selectedProducts[findProductBy].count;
        const maxCount = product.max;
        this.selectedProducts[findProductBy].count += nowCount < maxCount ? 1 : 0;
      }
    },

    // 장치 상태 체크
    async deviceConnectState() {
      if (!this.serialport.isConnected()) {
        await this.$bvModal.msgBoxOk('장치와의 통신이 원활하지 않습니다', {
          okTitle: '돌아가기',
          centered: true,
          size: 'lg',
        });

        this.$router.push('/');
      }

      return this.serialport.isConnected();
    },

    // 장치 healthCheck
    async healthCheck() {
      // this.serialport.wirte('[q A X]');

      // return await this.serialport.messageEvent.pipe(take(1)).toPromise();
      return this.parser.parse('[r A Q001/R001/S010&Q001/R002/S010&Q002/R001/S005]');
    },

    removeBucketProduct(index) {
      if (index === -1) {
        this.selectedProducts = [];
      } else {
        this.selectedProducts.splice(index, 1);
      }
    },

    submit() {
      if (this.selectedProducts.length === 0) {
        this.$bvModal.msgBoxOk('상품을 선택해 주세요', { centered: true, size: 'lg', okTitle: '확인' });
        return;
      }

      this.$router.push({ name: 'pay', params: { products: this.selectedProducts } });
    },
  },
};
</script>
