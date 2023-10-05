import { Pipe, PipeTransform } from '@angular/core';
import {Device} from './models/Device';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(devices: Device[], SearchText: string): Device[] {
    if (!devices || !SearchText) {
      return devices;
    }
    return devices.filter(
      device => device.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase()) ||
                 device.identifiant.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase())//   ||
         // @ts-ignore
     //   device.Area.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase()) ||
        // // @ts-ignore
        // device.Ligne.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase())
    );
  }






}
