import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close } from 'ionicons/icons';

@Component({
  selector: 'app-alteracao-senha',
  templateUrl: './alteracao-senha.page.html',
  styleUrls: ['./alteracao-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonIcon]
})
export class AlteracaoSenhaPage implements OnInit {

  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;
  @ViewChild('inputConfirmaSenhaRef') inputConfirmaSenhaRef: ElementRef | undefined;
  public senha: string = '';
  public confirmaSenha: string = '';

  isPasswordVisible = false;
  isPasswordVisible1 = false;

  constructor() {
    addIcons({ add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close });
  }

  ngOnInit() {
  }

  limparInput(campo: 'senha' | 'confirmaSenha') {
    let inputRef: ElementRef | undefined;

    if (campo === 'senha') {
      this.senha = '';
      inputRef = this.inputSenhaRef;
    }
    else if (campo === 'confirmaSenha') {
      this.confirmaSenha = '';
      inputRef = this.inputConfirmaSenhaRef;
    }


    // Retorna o foco
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.focus();
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }

}
