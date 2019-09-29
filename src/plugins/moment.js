import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment';

Vue.prototype.moment = moment;
Vue.use(VueMoment);
