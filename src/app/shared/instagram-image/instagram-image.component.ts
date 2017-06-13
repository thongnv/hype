import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-instagram-image',
  templateUrl: './instagram-image.component.html',
  styleUrls: ['./instagram-image.component.css']
})
export class InstagramImageComponent implements OnInit {
  @Input('src') public src: string;
  @Input('width') public width: number;
  @Input('height') public height: number;

  public srcImg: string = '';
  public altImg: string = '';

  constructor(private mainService: MainService) {
  }

  public ngOnInit() {
    this.mainService.getInstagramImage(this.src).then((response) => {
      console.log('xxx response===> ', response);
      if (response.tag.media.nodes.length) {
        let isImage = false;
        let index = 0;
        while (!isImage) {
          if (response.tag.media.nodes[index].is_video === false) {
            this.srcImg = response.tag.media.nodes[index].thumbnail_src;
            this.altImg = response.tag.media.nodes[index].caption;
            isImage = true;
          }else {
            index++;
          }
        }

      }
    });
  }

}
