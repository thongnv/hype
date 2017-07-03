import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SmallLoaderService } from './small-loader.service';
import { SmallLoaderState } from '../../app.interface';

@Component({
  selector: 'app-small-loader',
  templateUrl: './small-loader.component.html',
  styleUrls: ['./small-loader.component.css']
})
export class SmallLoaderComponent implements OnInit {

  public loading = false;

  private subscription: Subscription;

  constructor(private loaderService: SmallLoaderService) { }

  public ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: SmallLoaderState) => {
        this.loading = state.loading;
      });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
