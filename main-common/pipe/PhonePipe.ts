import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone' })

export class PhonePipe implements PipeTransform {
  transform(value: string | any) {
    let phoneNumber: string;
    let phoneExt: string;

    if (!value) {
      return '';
    }

    if (value instanceof Object) {
      if (value.phoneAreaCode && value.phoneAreaCode !== '') {
        phoneNumber = value.phoneAreaCode + value.phoneNumber;
      } else {
        phoneNumber = value.phoneNumber;
      }
      phoneExt = value.ext;
    } else {
      phoneNumber = value;
    }

    if (!phoneNumber) {
      return '';
    }

    if (phoneNumber.length > 10) {
      phoneNumber = phoneNumber.replace(/\D+/g, '');
    }

    if (phoneNumber.charAt(0) === '1') {
      phoneNumber = phoneNumber.substr(1, value.length);
    }

    if (phoneNumber.charAt(0) === '+') {
      phoneNumber = value.substr(2, value.length);
    }

    let newStr = '';
    let i = 0;
    for (; i < (Math.floor(phoneNumber.length / 3) - 1); i++) {
      newStr = newStr + phoneNumber.substr(i * 3, 3) + '-';
    }
    let temp: number = (i + 1) * 2;
    if (i < 2) {
      temp = temp - 1;
    }
    i = temp;
    if (phoneExt && phoneExt !== '') {
      return newStr + phoneNumber.substr(i) + ' Ext: ' + phoneExt;
    }
    return newStr + phoneNumber.substr(i);
  }
}
