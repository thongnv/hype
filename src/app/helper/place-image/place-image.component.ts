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
  @Input('licenseNumber') public licenseNumber: string;

  public url: string = 'assets/img/company/default_140x140.jpg';

  constructor(
    public companyService: CompanyService
  ) {}

  public ngOnInit(): void {
    // TODO: use this.name instead
    this.companyService.getInstagramProfile(this.licenseNumber).subscribe(
      (profile) => {
        this.url = profile[0] ? profile[0] : 'assets/img/company/default_140x140.jpg';
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
