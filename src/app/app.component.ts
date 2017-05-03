import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl : 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    public appState: AppState
  ) {}
    public mapOptions: any[];
    public selectedMapOption: any;

    public onSelectMapOption(option: any): void{
        this.selectedMapOption = option;
    }
  public ngOnInit() {

      this.mapOptions=[
          {id: 1, name: 'singapore'},
          {id: 2, name: 'neighbourhood'},
          {id: 3, name: 'option 2'},
          {id: 4, name: 'option 3'}
      ];

      this.selectedMapOption = this.mapOptions[0];

    console.log('Initial App State', this.appState.state);
  }
}
