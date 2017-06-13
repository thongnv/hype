import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myHtml2Text'
})
export class Html2TextPipe implements PipeTransform {

  public transform(value: string, args?: any): any {
    return value.replace(/<\/?[^>]+(>|$)/g, '');
  }

}
