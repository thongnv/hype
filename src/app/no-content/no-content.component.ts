import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div id="notFoundDiv" class="not-found">
      <div>
        <div class="sprite sprite-no-results-found-2x" style="display: inline-block"></div>
      </div>
      <h1>Page Not Found</h1>
      <div>Sorry, the page you are looking for does not exist.</div>
      <h4><a routerLink="/" class="clear_filter" style="text-align: center">Back To Home</a></h4>
    </div>
  `
})
export class NoContentComponent {

}
