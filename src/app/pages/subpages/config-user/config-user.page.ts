import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sunny, moon, phonePortrait, close, arrowBackOutline} from 'ionicons/icons';
import { Location } from '@angular/common'; 
import { Router } from '@angular/router';   

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.page.html',
  styleUrls: ['./config-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigUserPage implements OnInit {

  constructor(
    private location: Location, 
    private router: Router
  ) { 
    addIcons({ sunny, moon, phonePortrait, close, arrowBackOutline});
  }

  ngOnInit() {
  }
  
  voltar() {
    this.location.back(); 
  }
}
