import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonRippleEffect,
    IonFab,
    IonFabButton,
    IonFabList,
    IonModal,
    IonLabel, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

// Importações do Capacitor
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import { addIcons } from 'ionicons';
import { close, home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, locate, image } from 'ionicons/icons';
import { AlertController, PopoverController, LoadingController, RefresherCustomEvent } from '@ionic/angular/standalone';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { Subscription, Observable } from 'rxjs'; // <-- CORREÇÃO: Importação do Observable
import { RefresherEventDetail } from '@ionic/angular';

// Presumo que estas interfaces e o Service estão no mesmo arquivo ou que HospitalService as importa corretamente
import { HospitalService, HospitalProcessado, HospitalBackend } from '../../services/sistema-hospital/hospital';

import { finalize } from 'rxjs/operators';

import { GoogleMapsViewerComponent } from '../../components/google-maps/google-maps-viewer/google-maps-viewer.component'; // <-- Importe o novo componente


// --- REMOVEMOS A INTERFACE 'Hospital' MOCKADA PARA EVITAR CONFLITO DE TIPOS ---
// Agora usaremos HospitalProcessado em todos os lugares.
// -----------------------------------------------------------------------------


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonSpinner,
        IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
        IonList, IonItem, IonThumbnail, IonRippleEffect, CommonModule, FormsModule,
        IonFab, IonFabButton, IonFabList, IonModal, IonLabel, GoogleMapsViewerComponent
    ]
})
export class HomePage implements OnInit, OnDestroy {

    // --- VARIÁVEIS DE ESTADO DO COMPONENTE ---
    public hospitais: HospitalProcessado[] = [];
    public carregando: boolean = false;
    public erroCarregamento: boolean = false;
    public mensagemErro: string = '';
    public data: string = this.dateService.getFormattedDate();

    // Variáveis de Modo de Interação
    public isEditingMode: boolean = false;
    public isDeletingMode: boolean = false;

    // Variáveis de Modal
    public isModalOpenAdd: boolean = false;
    public isModalOpenEdit: boolean = false;
    public isModalOpenMap: boolean = false;
    public isModalOpenLocationSelect: boolean = false;

    // Variáveis para Formulário/Seleção
    public nomeHospital: string = '';
    public selectedHospital: HospitalProcessado | null = null;
    public tempLatitude: number | null = null;
    public tempLongitude: number | null = null;
    public hospitalPhoto: string | null = null; // Base64 da foto
    public hospitalPhotoFilename: string = 'foto_hospital.jpeg'; // Nome do arquivo para o backend

    private subscription: Subscription = new Subscription();
    isRefreshing = false;

    constructor(
        private router: Router,
        private dateService: DateService,
        public alertController: AlertController,
        private popoverCtrl: PopoverController,
        private loadingController: LoadingController,
        private toastController: ToastController,
        private hospitalService: HospitalService
    ) {
        addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, locate, image, close });
    }

    // GETTER PARA O TÍTULO DINÂMICO
    get pageTitle(): string {
        if (this.isEditingMode) {
            return 'Modo de Edição Ativo';
        }
        if (this.isDeletingMode) {
            return 'Modo de Exclusão Ativo';
        }
        return 'Bem-Vindo Ao FilaMed';
    }

    async ngOnInit() {
        await this.carregarHospitais();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateTempCoords(event: { lat: number, lng: number }) {
        this.tempLatitude = event.lat;
        this.tempLongitude = event.lng;
    }

    async carregarHospitais() {
        this.carregando = true;
        this.erroCarregamento = false;

        this.subscription.add(
            this.hospitalService.getAllHospitais()
                .pipe(finalize(() => this.carregando = false))
                .subscribe({
                    next: (data) => {
                        this.hospitais = data;
                        this.erroCarregamento = false;
                    },
                    error: (err: any) => { // <-- CORREÇÃO: Tipo 'any' adicionado
                        console.error('Erro ao carregar hospitais:', err);
                        this.erroCarregamento = true;
                        this.mensagemErro = 'Não foi possível carregar os dados. Tente novamente.';
                        this.presentToast('Erro ao carregar dados.', 'danger');
                    }
                })
        );
    }

    // <-- CORREÇÃO: A SEGUNDA IMPLEMENTAÇÃO DE handleRefresh FOI REMOVIDA.
    // Mantenho apenas a primeira, que faz o refresh correto:
    handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        this.carregarHospitais()
            .then(() => event.detail.complete())
            .catch(() => event.detail.complete());
    }


    // -----------------------------------------------------------
    // LÓGICA DE MODAIS E FORMULÁRIOS
    // -----------------------------------------------------------

    setOpenAdd(isOpen: boolean, hospital: HospitalProcessado | null = null) {
        this.isModalOpenAdd = isOpen;
        this.selectedHospital = hospital; // Este é o ponto chave!
        if (!isOpen) {
            this.nomeHospital = '';
            this.hospitalPhoto = null;
            this.tempLatitude = null;
            this.tempLongitude = null;
        } else {
            this.getCurrentLocation();
        }
    }

    setOpenEdit(isOpen: boolean, hospital: HospitalProcessado | null = null) {
        this.isModalOpenEdit = isOpen;
        this.selectedHospital = hospital; // ✅ Se 'hospital' não for nulo, o ID está aqui.

        

    if (isOpen && hospital) {
        // ✅ ATENÇÃO: Carregue as variáveis do formulário com os dados EXISTENTES
        this.nomeHospital = hospital.nome;
        
        // 🚨 O TEMPLongitude e TEMPlatitude DEVEM ser carregados do hospital selecionado!
        this.tempLatitude = hospital.lati; 
        this.tempLongitude = hospital.longi;
        
        this.hospitalPhoto = null; 
    } else if (!isOpen) {
        // Ao fechar, limpa
        this.selectedHospital = null;
        this.nomeHospital = '';
        this.tempLatitude = null;
        this.tempLongitude = null;
        this.hospitalPhoto = null;
    }
    }

    // -----------------------------------------------------------
    // AÇÕES DE MAPA E CÂMERA (Capacitor)
    // -----------------------------------------------------------

    async openCamera() {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
            });

            this.hospitalPhoto = image.dataUrl || null;
            this.hospitalPhotoFilename = `foto_${Date.now()}.jpeg`;
        } catch (error) {
            console.error('Erro ao abrir a câmera:', error);
            this.presentToast('Não foi possível acessar a câmera ou galeria.', 'warning');
        }
    }

    // -----------------------------------------------------------
    // MÉTODOS DE AÇÃO DE DADOS (USANDO O SERVICE)
    // -----------------------------------------------------------

    async deleteHospital(hospital: HospitalProcessado) {
        const alert = await this.alertController.create({
            header: 'Confirma Exclusão?',
            message: `Tem certeza que deseja deletar o hospital ${hospital.nome}?`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Deletar',
                    handler: async () => {
                        const loading = await this.loadingController.create({ message: 'Excluindo...' });
                        await loading.present();

                        this.subscription.add(
                            this.hospitalService.deleteHospital(hospital.id)
                                .pipe(finalize(() => loading.dismiss()))
                                .subscribe({
                                    next: () => {
                                        this.presentToast(`Hospital ${hospital.nome} excluído.`, 'success');
                                        this.carregarHospitais();
                                    },
                                    error: (err: any) => { // <-- CORREÇÃO: Tipo 'any' adicionado
                                        console.error('Erro ao excluir:', err);
                                        this.presentToast('Erro ao excluir hospital.', 'danger');
                                    }
                                })
                        );
                    },
                },
            ],
        });
        await alert.present();
    }

    async salvarConfig() {
        if (!this.nomeHospital || this.tempLatitude === null || this.tempLongitude === null) {
            this.presentToast('Preencha nome e localize o hospital.', 'warning');
            return;
        }

        const loading = await this.loadingController.create({
            message: this.isModalOpenAdd ? 'Adicionando hospital...' : 'Atualizando hospital...'
        });
        await loading.present();

        // 1. Prepara os dados de texto
        // ⚠️ Correção aqui: Tipar como Partial<HospitalBackend> e garantir que o ID está presente.
        // 1. Prepara os dados de texto
        const hospitalData: Partial<HospitalBackend> = {
            // Se estiver no modo de edição, use o ID do selectedHospital
            id: this.isModalOpenEdit ? this.selectedHospital?.id : undefined,
            nome: this.nomeHospital,
            lati: this.tempLatitude,
            longi: this.tempLongitude,
        };

        // ⚠️ Mantenha este bloco de erro, mas ele deve ser acionado apenas se o fluxo anterior falhar.
        if (this.isModalOpenEdit && !hospitalData.id) {
            loading.dismiss();
            this.presentToast('Erro de Edição: ID do hospital não encontrado. Tente reabrir o modal.', 'danger');
            return;
        }

        // 2. Cria o FormData, incluindo a foto Base64
        const formData = this.hospitalService.createFormData(
            hospitalData,
            this.hospitalPhoto,
            this.hospitalPhotoFilename
        );

        let request$: Observable<any>;
        let successMessage: string;

        if (this.isModalOpenAdd) {
            request$ = this.hospitalService.addHospital(formData);
            successMessage = 'Hospital adicionado com sucesso!';
        } else if (this.isModalOpenEdit && this.selectedHospital) {
            request$ = this.hospitalService.updateHospital(formData);
            successMessage = 'Hospital atualizado com sucesso!';
        } else {
            loading.dismiss();
            return;
        }

        // 3. Executa a requisição
        this.subscription.add(
            request$.pipe(finalize(() => loading.dismiss()))
                .subscribe({
                    next: () => {
                        this.presentToast(successMessage, 'success');
                        this.setOpenAdd(false);
                        this.setOpenEdit(false);
                        this.carregarHospitais();
                    },
                    error: (err: any) => { // <-- CORREÇÃO: Tipo 'any' adicionado
                        console.error('Erro na requisição:', err);
                        this.presentToast('Erro ao salvar os dados. Verifique o servidor.', 'danger');
                    }
                })
        );
    }


    // --- MÉTODOS AUXILIARES DE TOAST (Usando ToastController) ---

    async presentToast(message: string, color: string = 'primary') {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            color: color,
            buttons: [{ text: 'FECHAR', role: 'cancel' }]
        });
        await toast.present();
    }


    // -----------------------------------------------------------
    // LÓGICA DE MODOS E NAVEGAÇÃO
    // -----------------------------------------------------------

    toggleMode(mode: 'edit' | 'delete') {
        if (mode === 'edit') {
            this.isDeletingMode = false;
            this.isEditingMode = !this.isEditingMode;
        } else if (mode === 'delete') {
            this.isEditingMode = false;
            this.isDeletingMode = !this.isDeletingMode;
        }
    }

    exitMode() {
        this.isEditingMode = false;
        this.isDeletingMode = false;
    }


    irParaConfiguracao() {
        // Lógica de Redirecionamento de Configuração
    }

    async presentPopover(event: Event) {
        const popover = await this.popoverCtrl.create({
            component: SimplePopoverComponent,
            event
        });
        await popover.present();
    }

    // -----------------------------------------------------------
    // LÓGICA DE MAPA E LOCALIZAÇÃO (Capacitor)
    // -----------------------------------------------------------

    viewHospitalOnMap(hospital: HospitalProcessado) { // <-- CORREÇÃO: Usando HospitalProcessado
        if (this.isEditingMode || this.isDeletingMode) return;

        this.selectedHospital = hospital;
        this.isModalOpenMap = true;
    }

    openLocationSelectionModal() {
        if (this.selectedHospital) {
            this.tempLatitude = this.selectedHospital.lati;
            this.tempLongitude = this.selectedHospital.longi;
        }

        this.getCurrentLocation();
        this.isModalOpenLocationSelect = true;
    }

    async getCurrentLocation() {
        try {
            const position = await Geolocation.getCurrentPosition();
            this.tempLatitude = position.coords.latitude;
            this.tempLongitude = position.coords.longitude;
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            this.presentToast('Não foi possível obter a localização atual.', 'warning');
        }
    }

    saveSelectedLocation() {
        if (this.tempLatitude !== null && this.tempLongitude !== null) {
            if (this.selectedHospital) {
                this.selectedHospital.lati = this.tempLatitude;
                this.selectedHospital.longi = this.tempLongitude;
            }
        }
        this.isModalOpenLocationSelect = false;
    }


    // --- MÉTODOS AUXILIARES DE DISPLAY ---
    getDistanciaDisplay(hospital: HospitalProcessado): string { // <-- CORREÇÃO: Usando HospitalProcessado
        const distancia = hospital.distanciaRota ?? hospital.distancia;
        return distancia ? this.formatarDistancia(distancia) : '?';
    }

    getTempoDeslocamentoDisplay(hospital: HospitalProcessado): string { // <-- CORREÇÃO: Usando HospitalProcessado
        return hospital.tempoDeslocamento ? `${hospital.tempoDeslocamento} min` : 'Calculando...';
    }

    getTempoEsperaDisplay(hospital: HospitalProcessado): string { // <-- CORREÇÃO: Usando HospitalProcessado
        return hospital.tempo_espera ? this.formatarTempo(hospital.tempo_espera) : '?';
    }

    formatarTempo(minutos: number): string {
        if (minutos < 60) {
            return `${minutos} min`;
        } else {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;
            return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
        }
    }

    formatarDistancia(km: number): string {
        return km < 1 ? `${(km * 1000).toFixed(0)}m` : `${km.toFixed(1)}km`;
    }
}