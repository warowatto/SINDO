<template>
  <div id="status-bar">
    <ul class="status-list">
      <li>인터넷</li>
      <li>터치</li>
    </ul>
    <div class="time">10:10</div>
  </div>
</template>

<script>
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';

export default {
  data() {
    return {
      time: moment(),
    };
  },
  mounted() {
    interval(1000).pipe(map(() => moment()))
      .subscribe(date => this.time = date, () => {});
  },
  computed: {
    printTime() {
      return this.time.format('A hh:mm');
    },
  },
};
</script>