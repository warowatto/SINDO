import Serial from '../modules/serial';
import Parser from '../modules/parser';
import Vue from 'vue';

Vue.prototype.serialport = new Serial('/dev/tty.usbserial-AL01RPHY');
Vue.prototype.parser = new Parser();
