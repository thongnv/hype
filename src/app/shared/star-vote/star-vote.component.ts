import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-vote',
  templateUrl: './star-vote.component.html',
  styleUrls: ['./star-vote.component.css']
})
export class StarVoteComponent {
  @Input('stars') public stars: number;
  @Output('onVote') public onVote = new EventEmitter<any>();

  public onClick(item: number): void {
    this.onVote.emit(item);
  }
}
