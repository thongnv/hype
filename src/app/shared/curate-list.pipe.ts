import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCurateList'
})
export class CurateListPipe implements PipeTransform {

  transform(items: any[], category_id: string): any {
    if (!items || !category_id || category_id === 'all') {
      return items;
    }
    return items.filter((item) => item.info.category_id === category_id );
  }

}
