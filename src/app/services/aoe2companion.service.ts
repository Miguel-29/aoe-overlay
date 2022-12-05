import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Aoe2companionService {
  dataAoe2companion = "https://data.aoe2companion.com/api/";

  constructor(private http: HttpClient) { }


  getMatches = (profile_ids: string) => {
    return this.http.get(this.dataAoe2companion + 'matches?profile_ids=' + profile_ids);
  }

  getProfile = (profile_ids: string) => {
    return this.http.get(this.dataAoe2companion + `profiles/${profile_ids}?profile_id=${profile_ids}`);
  }
}
