import {
  Component,
  OnInit
} from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./home.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = {value: ''};
  private data;
  private userProfile: any;
  // TypeScript public modifiers
  constructor(private mainService: MainService) {}

  public ngOnInit() {
    // this.title.getData().subscribe(data => this.data = data);
    this.getLoginStatus();
    this.data = {lat: 1.290270, lng: 103.851959};
    this.getUserProfile();
  }

  private getLoginStatus(): any {
    this.mainService.isLoggedIn();
  }

  private getUserProfile() {
    this.userProfile = this.mainService.getUserProfile()
  }
}
