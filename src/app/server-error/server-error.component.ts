import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div style="text-align: center">
      <h1>Page unavailable</h1>
       
      <p>Sorry, but the requested page is unavailable due to a server hiccup.</p>
       
      <p>Our engineers have been notified, so check back later.</p>
    </div>
  `
})
export class ServerErrorComponent {

}
