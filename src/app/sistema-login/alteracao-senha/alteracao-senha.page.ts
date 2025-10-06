import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close, navigate } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { AlteracaoSenhaService } from 'src/app/services/sistema-login/alteracao-senha';

import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-alteracao-senha',
  templateUrl: './alteracao-senha.page.html',
  styleUrls: ['./alteracao-senha.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonIcon
  ]
})
export class AlteracaoSenhaPage implements OnInit {

  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;
  @ViewChild('inputConfirmaSenhaRef') inputConfirmaSenhaRef: ElementRef | undefined;

  public senha: string = '';
  public confirmaSenha: string = '';

  isPasswordVisible = false;
  isPasswordVisible1 = false;

  constructor(
    private route: ActivatedRoute,
    public alterar_senha_service: AlteracaoSenhaService,
    public alertController: AlertController,
    public rt: Router) {
    addIcons({ add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close });
  }

  ngOnInit() {
    // pega o parâmetro da URL
    this.route.paramMap.subscribe(params => {
      const token = params.get('recupCode');
      if (token) {
        localStorage.setItem('resetToken', token);
      }
      else {
        console.log("error ao pegar parametros")
      }
    });
  }

  limparInput(campo: 'senha' | 'confirmaSenha') {
    let inputRef: ElementRef | undefined;

    if (campo === 'senha') {
      this.senha = '';
      inputRef = this.inputSenhaRef;
    } else if (campo === 'confirmaSenha') {
      this.confirmaSenha = '';
      inputRef = this.inputConfirmaSenhaRef;
    }

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

  async alterarSenha() {
    let senha = this.senha;
    let confirmaSenha = this.confirmaSenha;
    let recupCode = localStorage.getItem('resetToken') || '';

    if (senha == '' || senha == undefined || senha == null || confirmaSenha == '' || confirmaSenha == undefined || confirmaSenha == null) {
      const alert = await this.alertController.create({
        header: 'Preencha os campos corretamente!',
        buttons: [{
          text: 'OK',
          role: 'OK',
          handler: () => {

          },
        },],
      });

      await alert.present();
    }
    else if (senha != confirmaSenha) {
      const alert = await this.alertController.create({
        header: 'As senhas não se coincidem!',
        buttons: [{
          text: 'OK',
          role: 'OK',
          handler: () => {

          },
        },],
      });

      await alert.present();
    }
    else {
      this.alterar_senha_service
        .alterarSenha(recupCode, senha)
        .subscribe({
          // 1. CALLBACK DE SUCESSO (next) - Chamado SOMENTE se o HTTP retornar 200/OK
          next: async (_res: any) => {
            if (_res.message == 'Senha do usuário atualizada com sucesso') {

              const alert = await this.alertController.create({
                header: `Senha alterada com sucesso!`,
                buttons: [{
                  text: 'OK',
                  role: 'OK',
                  handler: () => {
                    
                    
                  },
                },],
              });
              await alert.present();
              localStorage.removeItem('resetToken');
              this.rt.navigate(['/login'])
            } else {


            }
          },

          // 2. CALLBACK DE ERRO (error) - Chamado quando o HTTP retorna status 4xx, 5xx, ou falha de rede
          error: async (err: any) => {
            const alert = await this.alertController.create({
              header: 'Erro interno!',// Adicione uma mensagem mais clara
              buttons: [{
                text: 'OK',
                role: 'OK',
                handler: () => {
                  console.log(err)
                },
              },],
            });

            await alert.present();
          }
        });
    }
  }

}
