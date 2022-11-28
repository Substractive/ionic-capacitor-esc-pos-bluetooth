import { Component } from '@angular/core';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  MAC_ADDRESS = 'DC:0D:51:F2:57:99'; // check your mac address in listDevices or discoverUnpaired
  constructor(private bluetoothSerial: BluetoothSerial) {
    let encoder = new EscPosEncoder();

    let result = encoder
      .initialize()
      .text('The quick brown fox jumps over the lazy dog')
      .newline()
      .qrcode('https://nielsleenheer.com')
      .encode();

    console.log(result);

  }


  listDevices(){
    console.log("LIST DEVICES");
    this.bluetoothSerial.list().then(function(devices) {
      devices.forEach(function(device: any) {
        console.log("Device id: ", device.id);
        console.log("Device name: ", device.name);
      })
    }).catch((e) =>{
      console.error(e);
    });
  }

  discoverUnpaired(){
    console.log("LIST UNPAIRED DEVICES");
    this.bluetoothSerial.discoverUnpaired().then(function(devices) {
      devices.forEach(function(device: any) {
        console.log("Unpaired device ID: ", device.id);
        console.log("Unpaired device NAME: ", device.name);
      })
    }).catch((e) => {
      console.error(e);
    });
  }

  demoPrint(){
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('windows1250')
      .align('center')
      .newline()
      .line('Congratulation, print success')
      .line('Bluetooth MAC :')
      .line('Bluetooth MAC : ' + this.MAC_ADDRESS)
      .newline()
      .newline()
      .align('left')
      .qrcode('https://maliured.hr')
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();

    // send byte code into the printer
    this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(() => {
      this.bluetoothSerial.write(resultByte)
        .then(() => {
          this.bluetoothSerial.clear();
          this.bluetoothSerial.disconnect();
          console.log('Print success');
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}
