import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'firstuppercase'})
export class FirstUpperCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    if (typeof value !== 'string') {
      return value;
    }
    var chars = value.split('');
    var firstChar = chars[0].toUpperCase();
    var word = firstChar;
    for(let i = 1; i<chars.length; i++){
        word = word + chars[i];
    }
    return word;
  }
}