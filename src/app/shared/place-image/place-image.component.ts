import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-place-image',
  templateUrl: './place-image.component.html',
  styleUrls: ['./place-image.component.css']
})
export class PlaceImageComponent implements OnInit {

  @Input('name') public name: string;
  @Input('width') public width: string;
  @Input('height') public height: string;

  public url: string;

  constructor(
    public companyService: CompanyService
  ) {}

  public ngOnInit(): void {
    // TODO: use this.name instead
    let instagramUsername = 'billnguyen254';
    this.companyService.getInstagramProfile(instagramUsername).subscribe(
      (profile) => {
        this.url = profile.data[0].profile_picture;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
