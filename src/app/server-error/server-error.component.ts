import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <h1>Page unavailable</h1>
     
    <p>Sorry, but the requested page is unavailable due to a server hiccup.</p>
     
    <p>Our engineers have been notified, so check back later.</p>
  `
})
export class ServerErrorComponent {

}
