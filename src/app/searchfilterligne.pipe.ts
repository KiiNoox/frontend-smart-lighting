import { Pipe, PipeTransform } from '@angular/core';
import {Ligne} from './models/Ligne';
import {Device} from './models/Device';
@Pipe({
  name: 'searchfilterligne'
})
export class SearchfilterlignePipe implements PipeTransform {

  transform(lignes: Ligne[], SearchText: string): Ligne[] {
    if (!lignes || !SearchText) {
      return lignes;
    }
    // @ts-ignore
    return lignes.filter(
      ligne => ligne.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase()) ||
        // @ts-ignore
        ligne.Area.name.toLocaleLowerCase().includes(SearchText.toLocaleLowerCase())
    );
  }
}
