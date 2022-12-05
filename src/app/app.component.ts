import { Component } from '@angular/core';
import { Aoe2companionService } from './services/aoe2companion.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  profileForm = new FormGroup({
    idProfile: new FormControl(''),
  });
  match: any = {};
  teams: any = [];

  constructor (private Aoe2companionservice: Aoe2companionService) {}

  initQuery = async() => {
    let data = await this.getMatches(this.profileForm.value.idProfile as string)  
    this.match = data.matches[0];
    this.match.teams.forEach((team: any, indexTeam: any) => {
      this.teams[indexTeam] = [];
      team.forEach((player: any, indexPlayer: any) => {
        this.getProfile(player, indexTeam, indexPlayer);          
      });
    });  
  }

  getMatches = async(idProfile: string): Promise<any> => {
    return new Promise((resolve) => {
      this.Aoe2companionservice.getMatches(idProfile).subscribe((res: any) => {
        resolve(res)
        return        
      })
    }) 
  }

  getProfile = async(player: any, index: number, indexP: number) => {
    this.Aoe2companionservice.getProfile(player.profile_id).subscribe((res: any) => {
      res.leaderboards[0].avg = this.calcAvg(res.leaderboards[0].wins, res.leaderboards[0].losses);
      res.leaderboards[1].avg = this.calcAvg(res.leaderboards[1].wins, res.leaderboards[1].losses);      
      this.getLogos(player.profile_id, index, index, {profile: player, rm1v1: res.leaderboards[0], tg: res.leaderboards[1]});    
    });
  }

  getLogos = async(id: any, index: any, indexP: any, data: any) => {
    this.teams[index].push({...data});
    if(this.match.teams == index + 1 && this.match.teams[index][indexP] == indexP + 1) {
      let matches = await this.getMatches(id);
      this.teams[index][indexP].push(matches);
      console.log(this.teams);
    }
  }

  calcAvg = (wins: number, losses: number) => {
    let avg = 0;
    avg = wins * 100;
    avg = avg / (wins + losses);
    return Math.round(avg);
  } 
}
