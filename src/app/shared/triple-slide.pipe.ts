import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myTripleSlide'
})
export class TripleSlidePipe implements PipeTransform {

  public transform(value: any[], args?: any): any {
    let returnValue = [];
    let tmpSlide = [];
    let countSlide = 0;
    value.forEach((item) => {
      if (item.info.type === 'popular_pick' && (item.info.category_id === args || args === 'all')) {
        if (countSlide === 3) {
          returnValue.push(tmpSlide);
          countSlide = 0;
          tmpSlide = [];
        } else {
          tmpSlide.push(item);
          countSlide++;
        }
      }
    });
    return returnValue;
  }

}
