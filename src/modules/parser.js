import HashMap from 'hashmap';
import { chain } from 'lodash';
import numeral from 'numeral';

class MessageNotValideExecption extends Error {
  constructor(message) {
    super('명령 포멧이 맞지 않습니다' + ' ' + message);
  }
}

export default class VendingMachineAPIParser {
  constructor() {
    this.commend = new HashMap()
      .set('A', { commend: 'A', label: 'stock', description: '재고상황' })
      .set('B', { commend: 'B', label: 'cash', description: '현금결제' })
      .set('C', { commend: 'C', label: 'card', description: '카드결제' });

    this.data = new HashMap()
      .set('Q', {
        commend: 'Q',
        label: 'machine',
        description: '자판기 번호',
      })
      .set('R', {
        commend: 'R',
        label: 'Product',
        description: '상품 번호',
      })
      .set('S', {
        commend: 'S',
        label: 'productStock',
        description: '상품 재고량',
      })
      .set('T', {
        commend: 'T',
        label: 'productPrice',
        description: '투입을 요구하는 금액',
      })
      .set('U', {
        commend: 'U',
        label: 'amount',
        description: '투입된 금액 데이터 명시',
      })
      .set('V', {
        commend: 'V',
        label: 'returns',
        description: '거스름돈 데이터',
      })
      .set('W', {
        commend: 'W',
        label: '',
        description: '',
      })
      .set('X', {
        commend: 'X',
        label: 'emptyParmas',
        description: '데이터 없음',
      })
      .set('Y', {
        commend: 'Y',
        label: 'methodRunning',
        description: '정상 / 에러 데이터 명시',
      });

    this.params = new HashMap()
      .set('ok', { label: 'status', value: true })
      .set('fail', { label: 'status', value: false })
      .set('a', { label: 'check', value: null })
      .set('b', { label: 'check', value: '잔돈부족', code: 200, type: 'error' })
      .set('c', { label: 'check', value: '잔돈부족', code: 401, type: 'error' })
      .set('d', { label: 'check', value: '반환버튼 입력', code: 301, type: 'event' })
      .set('e', { label: 'check', value: '투입시간 초과', code: 404, type: 'error' })
      .set('f', { label: 'check', value: '사유 없음' })
      .set('g', { label: 'check', value: '사유 없음' })
      .set('h', { label: 'check', value: '사유 없음' })
      .set('i', { label: 'check', value: '잔돈부족', code: 500, type: 'error' });

    this.error = new HashMap()
      .set('A')
      .set('B')
      .set('C');
  }

  valideCheck(message) {
    const regex = /^\[(q|r) [A-I]{1} ((Q{1}[0-9]{3}\/R{1}[0-9]{3}\/S{1}[0-9]{3})|([T-V]{1}[0-9]{6})|([X]{1})|([Y]{1}[a-i]{1}))(&((Q{1}[0-9]{3}\/R{1}[0-9]{3}\/S{1}[0-9]{3})|([T-V]{1}[0-9]{6})|([Y]{1}[a-i]{1})))*\]$/;
    return regex.test(message);
  }

  parse(message) {
    if (!this.valideCheck(message)) throw new MessageNotValideExecption(message);

    const messageBody = message.replace('[', '').replace(']', '');
    const [sender, commend, data] = messageBody.split(' ');

    const dataParser = chain(data.split('&'))
      .map((itemText) => {
        let results = {};

        itemText.split('/').forEach((text) => {
          const key = text.substring(0, 1);
          const value = text.substring(1, text.length);
          const param = numeral(value).value() || this.params.get(value);
          results[this.data.get(key).label] = param;
        });

        return results;
      })
      .flatten()
      .value();

    return {
      type: sender === 'q' ? 'request' : 'response',
      commend: this.commend.get(commend),
      data: dataParser,
      message,
    };
  }
}
