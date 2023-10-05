import { Pipe, PipeTransform } from '@angular/core';
import {Area} from './models/Area';
import {Device} from './models/Device';
@Pipe({
  name: 'searchfilterarea'
})
export class SearchfilterareaPipe implements PipeTransform {
  transform(areas: Area[], SearchText: string): Area[] {
    if (!areas || !SearchText) {
      return areas;
    }
    return areas.filter(
      area => area.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase()) ||
        area.Status.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase())
    );
  }
}
