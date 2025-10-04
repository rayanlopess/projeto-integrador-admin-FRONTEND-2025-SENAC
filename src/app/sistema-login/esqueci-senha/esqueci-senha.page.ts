import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonIcon]
})
export class EsqueciSenhaPage implements OnInit {
  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputEmailRef') inputEmailRef: ElementRef | undefined;
  public email: string = '';
  constructor() { }

  ngOnInit() {
  }

  limparInput(campo: 'email') {
    let inputRef: ElementRef | undefined;

    if (campo === 'email') {
      this.email = '';
      inputRef = this.inputEmailRef;
    }


    // Retorna o foco
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.focus();
    }
  }
}
