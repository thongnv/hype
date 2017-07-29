import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'myTimeStamp'
})
export class StringTimeStamp implements PipeTransform {

  public transform(value: string): any {
    if (!value) {
      return value;
    }
    return moment(value).unix() * 1000;
  }

}
