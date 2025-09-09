import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-popover',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-list>
      <ion-item>
        <ion-icon name="create" slot="start"></ion-icon>
        <ion-label>Editar</ion-label>
      </ion-item>
      
      <ion-item>
        <ion-icon name="trash" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">Excluir</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    ion-list {
      padding: 0;
      margin: 0;
    }
    ion-item {
      --min-height: 48px;
    }
  `]
})
export class SimplePopoverComponent {

}