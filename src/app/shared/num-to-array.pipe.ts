import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myNum2Array'})
export class Num2Array implements PipeTransform {
  public transform(value, args: string[]): any {
    let res = [];
    for (let i = 0; i < Math.round(value); i++) {
      res.push(i);
    }
    return res;
  }
}
