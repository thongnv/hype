import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div>
      <div id="notFoundDiv" class="not-found">
        <div><div class="sprite sprite-no-results-found-2x" style="display: inline-block"></div></div>
        <h2>Page not Found</h2>
        <div>Sorry the page does not existed please <a [routerLink]="['/']" class="clear_filter">go home</a>.</div>
      </div>
    </div>
  `
})
export class NoContentComponent {

}
