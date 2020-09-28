import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {

  transform(value: string | any, args?: string): any {
    if (value instanceof Object) {

      let location: string = value.address1;

      if (value.address2) {
        if (location) {
          location += ' ' + value.address2;
        } else {
          location = value.address2;
        }
      }

      // trim
      if (location) {
        location = location.trim();
      }

      // check if address or else show lat/long
      if (!location) {
        const latitude = value.latitude ? (parseFloat(value.latitude)).toFixed(6) : '';
        const longitude = value.longitude ? (parseFloat(value.longitude)).toFixed(6) : '';
        location = 'Lat: ' + latitude + ' , Long: ' + longitude;
      }

      if (args === 'tooltip') {
        return location;
      } else {
        return location.substring(0, 35);
      }
    } else {
      return value;
    }
  }

}
