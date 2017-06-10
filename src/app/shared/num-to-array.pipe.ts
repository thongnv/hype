import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myArray'})
export class MyArray implements PipeTransform {
  public transform(value, args: string[]): any {
    let res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
