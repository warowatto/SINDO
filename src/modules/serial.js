import Serialport from 'serialport';
import MessageParser from './parser';
import { Readline } from 'serialport/lib/parsers';
import { Subject } from 'rxjs';

export default class VendingMachineSerial {
  constructor(comName) {
    this.messageParser = new MessageParser();
    this.statusEvent = new Subject();
    this.messageEvent = new Subject();

    this.port = new Serialport(comName, {
      baudRate: 38400,
      autoOpen: true,
    });

    this.parser = this.port.pipe(new Readline('\r\n'));

    this.port.on('open', () => {
      this.statusEvent.next({ status: true, port: this });
    });

    this.parser.on('data', (data) => {
      const responseText = data.toString().trim();
      const obj = this.messageParser.parse(responseText);
      this.messageEvent.next(obj);
    });

    this.port.on('close', () => {
      this.statusEvent.next({ status: false, port: this });
    });
  }

  isConnected() {
    return this.port.isOpen;
  }

  write(message) {
    this.port.write(message + '\r\n');
  }
}
