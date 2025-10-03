import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButtons, IonButton, IonIcon} from '@ionic/angular/standalone';
import { AutenticacaoService } from 'src/app/services/sistema-login/autenticacao';

import { addIcons } from 'ionicons';
import { add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonContent, IonButtons, IonButton, IonIcon, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputLoginRef') inputLoginRef: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;

  isPasswordVisible = false;
  isAnimating = false;
  public login:string = '';
  public senha:string = '';

  constructor(
    public titleService: Title,
    public autenticacaoService: AutenticacaoService,
    public alertController: AlertController,
    public rt: Router
  ) { 
    addIcons({ add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close });
  }

  ngOnInit() {

    this.titleService.setTitle("Login");

  }

  togglePasswordVisibility() {
    this.isAnimating = true;
    this.isPasswordVisible = !this.isPasswordVisible;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Tempo igual à duração da animação
  }
  
  esqueciSenha(){
    this.rt.navigateByUrl('/esqueci-senha');
  }

  logar(){
    let login = this.login;
    let senha = this.senha;

    this.autenticacaoService
    .logar(login, senha)
    .subscribe(
      (_res:any) => {

      
    })
  }
  limparInput(campo: 'login' | 'senha') {
    let inputRef: ElementRef | undefined;

    if (campo === 'login') {
      this.login = '';
      inputRef = this.inputLoginRef;
    }
    else if (campo === 'senha') {
      this.senha = '';
      inputRef = this.inputSenhaRef;
    }

    // Retorna o foco
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.focus();
    }
  }

}
