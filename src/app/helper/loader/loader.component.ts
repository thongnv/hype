import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService } from './loader.service';
import { LoaderState } from '../../app.interface';

@Component({
  selector: 'angular-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  public show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  public ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
