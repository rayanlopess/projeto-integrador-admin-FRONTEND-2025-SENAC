import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline } from 'ionicons/icons';
import { AlertController, PopoverController, LoadingController } from '@ionic/angular/standalone';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { HospitalService, HospitalProcessado } from '../../services/sistema-hospital/hospital';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {

  public hospitais: HospitalProcessado[] = [];
  public carregando: boolean = true;
  public erroCarregamento: boolean = false;
  public mensagemErro: string = '';
  public data: string = this.dateService.getFormattedDate();

  private subscription!: Subscription;

  constructor(
    private router: Router,
    private dateService: DateService,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private hospitalService: HospitalService,
    private loadingController: LoadingController
  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline });
  }

  async ngOnInit() {
    await this.carregarHospitais();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async carregarHospitais() {
    this.carregando = true;
    this.erroCarregamento = false;

    try {
      // Verifica se tem configurações salvas
      if (this.hospitalService.temConfiguracoesSalvas()) {
        await this.hospitalService.carregarHospitaisComConfiguracoesSalvas();
      } else {
        // Se não tem configurações, redireciona para configuração inicial
        
      }

      // Se inscreve para receber os hospitais
      this.subscription = this.hospitalService.hospitaisFiltrados$.subscribe({
        next: (hospitais) => {
          this.hospitais = hospitais;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar hospitais:', error);
          this.mensagemErro = 'Erro ao carregar hospitais. Verifique sua conexão.';
          this.erroCarregamento = true;
          this.carregando = false;
        }
      });

    } catch (error: any) {
      console.error('Erro:', error);
      this.mensagemErro = error.message || 'Erro ao carregar hospitais';
      this.erroCarregamento = true;
      this.carregando = false;
    }
  }

  async tentarNovamente() {
    await this.carregarHospitais();
  }

  irParaConfiguracao() {
    this.router.navigate(['/config-inicial']);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: SimplePopoverComponent,
      event
    });
    await popover.present();
  }

  async irHospital(hospital: HospitalProcessado) {
    const alert = await this.alertController.create({
      header: `Deseja realmente ir até ${hospital.nome}?`,
      message: `Tempo estimado: ${hospital.tempo_fila || '?'} minutos\nDistância: ${hospital.distancia} km`,
      cssClass: 'container-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancelarAction',
          handler: () => {
            console.log('Operação cancelada.');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          cssClass: 'confirmarAction',
          handler: async () => {
            // Aqui você pode implementar a navegação para o mapa ou abrir o GPS
            this.abrirNoMapa(hospital);
          },
        },
      ],
    });

    await alert.present();
  }

  private abrirNoMapa(hospital: HospitalProcessado) {
    // Implementação para abrir no aplicativo de mapas
    const userLocation = this.hospitalService.getLocalizacaoAtual();
    
    if (userLocation) {
      // URL para abrir no Google Maps com rota
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lati},${hospital.long}&travelmode=driving`;
      window.open(url, '_system');
    } else {
      // URL simples para o hospital
      const url = `https://www.google.com/maps/search/?api=1&query=${hospital.lati},${hospital.long}`;
      window.open(url, '_system');
    }
  }

}
