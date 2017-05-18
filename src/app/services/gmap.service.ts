import { Injectable } from '@angular/core';

@Injectable()
export class GmapService {

  public positions: GMarker[];

  constructor() {
    this.positions = [
      {lat: 1.290270, lng: 103.851959},
      {lat: 1.280270, lng: 103.851959},
      {lat: 1.271271, lng: 103.861969},
      {lat: 1.282270, lng: 103.871979},
      {lat: 1.293269, lng: 103.881959},
    ];
  }

}

interface GMarker {
  lat: number;
  lng: number;
}
