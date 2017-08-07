import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myHtml2Text'
})
export class Html2TextPipe implements PipeTransform {

  public transform(value: string, args?: any): any {
    return String(value)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\ufffd/g, '')
      .replace(/\ufffdI/g, '')
      .replace(/\ufffds/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '');
  }

}
