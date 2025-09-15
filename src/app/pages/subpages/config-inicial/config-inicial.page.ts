import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { HospitalService } from '../../../services/sistema-hospital/hospital'; // Add this import

@Component({
  selector: 'app-config-inicial',
  templateUrl: './config-inicial.page.html',
  styleUrls: ['./config-inicial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigInicialPage implements OnInit {
  public range: number = 50;
  public enderecoManual: string = '';
  public class_enderecoManual: string = '';
  public class_error: string = 'ion-touched ion-invalid';
  public usandoLocalizacaoAtual: boolean = false;
  public carregando: boolean = false; // Added loading state

  constructor(
    private router: Router, // Changed from public rt to private router
    private alertController: AlertController,
    private hospitalService: HospitalService // Added HospitalService
  ) {
    addIcons({ search });
  }

  ngOnInit() {
  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  async salvarConfig() {
    // Verifica se o usuário não forneceu nenhuma forma de localização
    if (!this.usandoLocalizacaoAtual && this.enderecoManual.trim() === '') {
      const alert = await this.alertController.create({
        header: 'Localização necessária',
        message: 'Selecione uma localização ou digite um endereço.',
        cssClass: 'container-alert',
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            cssClass: 'confirmarAction',
          },
        ],
      });

      await alert.present();
      return;
    }

    this.carregando = true;

    try {
      const config = {
        Distancia: this.range,
        EnderecoManual: this.usandoLocalizacaoAtual ? "false" : this.enderecoManual,
        LocalizacaoAtual: this.usandoLocalizacaoAtual ? "true" : "false"
      };

      localStorage.setItem('configuracoesUsuario', JSON.stringify(config));

      // Continua com a inicialização do serviço...
      if (this.usandoLocalizacaoAtual) {
        await this.hospitalService.inicializarComLocalizacaoAtual();
      } else {
        await this.hospitalService.inicializarComEndereco(this.enderecoManual);
      }

      await this.hospitalService.carregarHospitaisProximos(this.range);
      this.router.navigate(['/home']);

    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      
      const alert = await this.alertController.create({
        header: 'Erro',
        message: error.message || 'Erro ao processar localização. Tente novamente.',
        buttons: ['OK']
      });
      
      await alert.present();
    } finally {
      this.carregando = false;
    }
  }

  usarLocalizacaoAtual() {
    this.usandoLocalizacaoAtual = true;
    this.class_enderecoManual = ''; // Remove qualquer erro do campo de endereço manual
  }

  // Added method to handle manual address input
  onEnderecoManualChange() {
    if (this.enderecoManual.trim() !== '') {
      this.usandoLocalizacaoAtual = false;
    }
  }

  // Added getter for template
  get usandoEnderecoManual(): boolean {
    return !this.usandoLocalizacaoAtual && this.enderecoManual.trim() !== '';
  }
}