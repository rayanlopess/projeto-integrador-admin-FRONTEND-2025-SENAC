import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { addIcons } from 'ionicons';
import { home, map, call, settings, ellipsisVertical } from 'ionicons/icons';
import { Router } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-paths',
  templateUrl: './paths.page.html',
  styleUrls: ['./paths.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule], 

})
export class PathsPage implements OnInit {
  activeTab: string = 'home';
  constructor(
    private router: Router,
    public titleService: Title,
    private navCtrl: NavController, 
    private popoverCtrl: PopoverController
  ) {
    addIcons({ home, map, call, settings, ellipsisVertical });

    
  }

  ngOnInit() {
  
  }

   async presentPopover() {
    const popover = await this.popoverCtrl.create({
      translucent: true,
      side: 'bottom',
      alignment: 'end',
      cssClass: 'custom-popover',
      componentProps: {
        onActionClick: (action: string) => {
          this.handleMenuAction(action);
          popover.dismiss();
        }
      },
      component: null
    });

    // Adiciona o conteúdo diretamente como no AlertController
    Object.assign(popover, {
      header: 'Menu',
      buttons: [
        {
          text: 'Configurações',
          icon: 'settings',
          handler: () => {
            this.handleMenuAction('config');
          }
        },
        {
          text: 'Perfil',
          icon: 'person',
          handler: () => {
            this.handleMenuAction('profile');
          }
        },
        {
          text: 'Sair',
          icon: 'log-out',
          role: 'destructive',
          handler: () => {
            this.handleMenuAction('logout');
          }
        }
      ]
    });

    await popover.present();
  }

  handleMenuAction(action: string) {
    console.log('Ação selecionada:', action);
    
    switch (action) {
      case 'config':
        console.log('Abrindo configurações...');
        break;
      case 'profile':
        console.log('Abrindo perfil...');
        break;
      case 'logout':
        console.log('Fazendo logout...');
        break;
    }
  }

}
