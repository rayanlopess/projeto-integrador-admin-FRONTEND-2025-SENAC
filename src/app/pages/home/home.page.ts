import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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
    IonLabel,
    ToastController,
    ActionSheetController
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

// Importações do Capacitor
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import { addIcons } from 'ionicons';
import { close, home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, locate, image, camera, search } from 'ionicons/icons';
import { AlertController, PopoverController, LoadingController, RefresherCustomEvent, } from '@ionic/angular/standalone';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { Subscription, Observable, firstValueFrom } from 'rxjs'; // <-- CORREÇÃO: Importação do firstValueFrom
import { RefresherEventDetail } from '@ionic/angular';

// Importação do serviço de Geocodificação
import { GeocodingService, EnderecoCompleto } from '../../services/geocoding/geocoding.service';

// Presumo que estas interfaces e o Service estão no mesmo arquivo ou que HospitalService as importa corretamente
import { HospitalService, HospitalProcessado, HospitalBackend } from '../../services/sistema-hospital/hospital';

import { finalize } from 'rxjs/operators';

import { GoogleMapsViewerComponent } from '../../components/google-maps/google-maps-viewer/google-maps-viewer.component'; // <-- Importe o novo componente

import { BuscarLocalizacao } from '../../services/maps/buscar-localizacao';
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
        IonFab, IonFabButton, IonFabList, IonModal, IonLabel, GoogleMapsViewerComponent,
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
    public tempLongi: number | null = null; // 🚨 CORREÇÃO: Renomeado de tempLongitude para tempLong
    public hospitalPhoto: string | null = null; // Base64 da foto
    public hospitalPhotoFilename: string = 'foto_hospital.jpeg'; // Nome do arquivo para o backend

    public token = localStorage.getItem('token') || '';

    private subscription: Subscription = new Subscription();
    isRefreshing = false;

    private storageChangeListener = this.handleStorageChange.bind(this);

    public predictions: any[] = [];
    public enderecoManual: string = '';
    public class_enderecoManual: string = '';
    public class_error: string = 'ion-touched ion-invalid';

    constructor(
        private router: Router,
        private dateService: DateService,
        public alertController: AlertController,
        private popoverCtrl: PopoverController,
        private loadingController: LoadingController,
        private toastController: ToastController,
        private hospitalService: HospitalService,
        private geocodingService: GeocodingService,
        private actionSheetController: ActionSheetController,
        private cd: ChangeDetectorRef,
        private buscarLocalizacaoService: BuscarLocalizacao
    ) {
        addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, locate, image, close, camera, search });
    }

    private handleStorageChange(event: StorageEvent): void {
        // Verifica se a chave 'user' foi afetada.
        if (event.key === 'user' || event.key === 'token') {
            // Força o Angular a verificar novamente o getter pageTitle.
            this.cd.detectChanges();
        }
    }
    get pageTitle(): string {
        if (this.isEditingMode) {
            return 'Modo de Edição Ativo';
        }
        if (this.isDeletingMode) {
            return 'Modo de Exclusão Ativo';
        }
        // 3. Lê o valor do 'user' diretamente no getter, garantindo o dado mais recente.
        const usuarioTile = localStorage.getItem('user') || 'Usuário';
        return `Bem-Vindo, ${usuarioTile}`;
    }

    async ngOnInit() {
        window.addEventListener('storage', this.storageChangeListener);
        await this.carregarHospitais();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        window.removeEventListener('storage', this.storageChangeListener);
    }

    updateTempCoords(coords: { lat: number, lng: number }) {
        this.tempLatitude = coords.lat;
        this.tempLongi = coords.lng;
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
                        sessionStorage.setItem('hospitais', JSON.stringify(this.hospitais));
                    },
                    error: (err: any) => {
                        console.error('Erro ao carregar hospitais:', err);
                        this.erroCarregamento = true;
                        this.mensagemErro = 'Não foi possível carregar os dados. Tente novamente.';
                        this.presentToast('Erro ao carregar dados.', 'danger');
                    }
                })
        );
    }
    handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        this.carregarHospitais()
            .then(() => event.detail.complete())
            .catch(() => event.detail.complete());
    }



    setOpenAdd(isOpen: boolean, hospital: HospitalProcessado | null = null) {
        this.isModalOpenAdd = isOpen;
        this.selectedHospital = hospital; // Este é o ponto chave!
        if (!isOpen) {
            this.nomeHospital = '';
            this.hospitalPhoto = null;
            this.tempLatitude = null;
            this.tempLongi = null; // 🚨 CORREÇÃO: Usando tempLong
        } else {
            this.getCurrentLocation();
        }
    }
    async getCurrentLocation() {
        try {
            const position = await Geolocation.getCurrentPosition();
            this.tempLatitude = position.coords.latitude;
            this.tempLongi = position.coords.longitude; // Atualiza as coordenadas temporárias

        } catch (error) {
            console.error('Erro ao obter localização:', error);

        }
    }

    setOpenEdit(isOpen: boolean, hospital: HospitalProcessado | null = null) {
        this.isModalOpenEdit = isOpen;
        this.selectedHospital = hospital; // ✅ Se 'hospital' não for nulo, o ID está aqui.



        if (isOpen && hospital) {
            // ✅ ATENÇÃO: Carregue as variáveis do formulário com os dados EXISTENTES
            this.nomeHospital = hospital.nome;

            // 🚨 O TEMPlongitude e TEMPlatitude DEVEM ser carregados do hospital selecionado!
            this.tempLatitude = hospital.lati;
            this.tempLongi = hospital.longi; // 🚨 CORREÇÃO: Usando tempLong

            this.hospitalPhoto = null;
        } else if (!isOpen) {
            // Ao fechar, limpa
            this.selectedHospital = null;
            this.nomeHospital = '';
            this.tempLatitude = null;
            this.tempLongi = null; // 🚨 CORREÇÃO: Usando tempLong
            this.hospitalPhoto = null;
        }
    }

    // -----------------------------------------------------------
    // AÇÕES DE MAPA E CÂMERA (Capacitor)
    // -----------------------------------------------------------

    // home.page.ts

    async openCameraOrGallery() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Selecione a fonte da imagem',
            buttons: [
                {
                    text: 'Abrir Câmera',
                    icon: 'camera',
                    handler: () => {
                        this.takePicture(CameraSource.Camera);
                    }
                },
                {
                    text: 'Abrir Galeria (Álbum de Fotos)',
                    icon: 'image',
                    handler: () => {
                        this.takePicture(CameraSource.Photos);
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close',
                    role: 'cancel',
                    cssClass: 'cancelarAction'
                }
            ]
        });
        await actionSheet.present();
    }


    async takePicture(source: CameraSource) {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: source, // Usa a fonte selecionada
            });

            this.hospitalPhoto = image.dataUrl || null;
            this.hospitalPhotoFilename = `foto_${Date.now()}.jpeg`;
        } catch (error) {
            console.error('Erro ao acessar a mídia:', error);
            this.presentToast('Não foi possível acessar a câmera ou galeria.', 'warning');
        }
    }

    async deleteHospital(hospital: HospitalProcessado) {
        const alert = await this.alertController.create({
            header: 'Confirma Exclusão?',
            message: `Tem certeza que deseja deletar ${hospital.nome}?`,
            buttons: [
                { text: 'Cancelar', role: 'cancel', cssClass: 'confirmarAction' },
                {
                    text: 'Deletar',
                    cssClass: "cancelarAction",
                    handler: async () => {
                        const loading = await this.loadingController.create({ message: 'Excluindo...' });
                        await loading.present();

                        this.subscription.add(
                            this.hospitalService.deleteHospital(hospital.id, this.token)
                                .pipe(finalize(() => loading.dismiss()))
                                .subscribe({
                                    next: async () => {
                                        await this.exitMode()
                                        const alert = await this.alertController.create({
                                            header: `${hospital.nome} deletado com sucesso!`,
                                            buttons: [
                                                { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
                                            ],
                                        });
                                        await alert.present();

                                        await this.exitMode();

                                        await this.carregarHospitais();
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
        if (this.nomeHospital == '' || this.nomeHospital == null || this.nomeHospital == undefined || this.tempLatitude == null || this.tempLatitude == undefined || this.tempLongi == undefined || this.tempLongi === null) { // 🚨 CORREÇÃO: Usando tempLong
            const alert = await this.alertController.create({
                header: 'Preencha os campos corretamente',
                buttons: [
                    { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
                ],
            });
            await alert.present();
            return;
        }

        const loading = await this.loadingController.create({
            message: 'Buscando endereço e salvando hospital...'
        });
        await loading.present();

        // 🌟 ETAPA 1: GEOCODIFICAÇÃO REVERSA (Coordenadas -> Endereço)
        let fullAddress: EnderecoCompleto;
        try {
            // Usa o GeocodingService para obter os dados de endereço (UF, Cidade, Bairro, Logradouro)
            fullAddress = await this.geocodingService.getAddressFromCoords(
                this.tempLatitude,
                this.tempLongi // 🚨 CORREÇÃO: Usando tempLong
            );
        } catch (error: any) {
            loading.dismiss();
            console.error('Erro na Geocodificação Reversa:', error);
            return;
        }

        const hospitalData: Partial<HospitalBackend> = {
            // Se estiver no modo de edição, use o ID do selectedHospital
            id: this.isModalOpenEdit ? this.selectedHospital?.id : undefined,
            nome: this.nomeHospital,
            lati: this.tempLatitude, // Serão os valores originais se o usuário não arrastar
            longi: this.tempLongi, // 🚨 CORREÇÃO: Usando tempLong
            uf: fullAddress.uf,
            cidade: fullAddress.cidade,
            bairro: fullAddress.bairro,
            logradouro: fullAddress.logradouro,
        };

        // ⚠️ Mantenha este bloco de erro, mas ele deve ser acionado apenas se o fluxo anterior falhar.
        if (this.isModalOpenEdit && !hospitalData.id) {
            loading.dismiss();

            return;
        }

        // 3. Cria o FormData, incluindo a foto Base64
        const formData = this.hospitalService.createFormData(
            hospitalData,
            this.hospitalPhoto,
            this.hospitalPhotoFilename
        );

        // MENSAGEM DE DEBUG: VERIFICAR CONTEÚDO DO FORMDATA
        console.log("--- DEBUG: Conteúdo do FormData Enviado ---");
        formData.forEach((value, key) => {
            // Se o valor for um Blob (a foto), ele mostrará o tipo.
            if (value instanceof Blob) {
                console.log(`${key}: [Blob/Arquivo - Tamanho: ${value.size} bytes, Tipo: ${value.type}]`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });
        console.log("-------------------------------------------");
        // ...

        let request$: Observable<any>;
        let successMessage: string;

        if (this.isModalOpenAdd) {
            request$ = this.hospitalService.addHospital(formData, this.token);
            successMessage = 'Hospital adicionado com sucesso!';
        } else if (this.isModalOpenEdit && this.selectedHospital) {
            request$ = this.hospitalService.updateHospital(formData, this.token);
            successMessage = 'Hospital atualizado com sucesso!';
        } else {
            loading.dismiss();
            return;
        }

        // 4. Executa a requisição
        this.subscription.add(
            request$.pipe(finalize(() => loading.dismiss()))
                .subscribe({
                    next: async () => {

                        this.setOpenAdd(false);
                        this.setOpenEdit(false);
                        this.carregarHospitais();
                        const alert = await this.alertController.create({
                            header: successMessage,
                            buttons: [
                                { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
                            ],
                        });
                        await alert.present();
                        await this.exitMode();
                    },
                    error: (err: any) => { // <-- CORREÇÃO: Tipo 'any' adicionado
                        console.error('Erro na requisição:', err);
                        this.presentToast('Erro ao salvar os dados. Verifique o servidor.', 'danger');
                        console.log(request$)
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

    async toggleMode(mode: 'edit' | 'delete') {
        if (mode === 'edit') {
            if (sessionStorage.getItem('hospitais') == '[]') {
                const alert = await this.alertController.create({
                    header: `Não há hospitais cadastrados para editar!`,
                    buttons: [
                        { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
                    ],
                });
                await alert.present();
                return;
            }
            this.isDeletingMode = false;
            this.isEditingMode = !this.isEditingMode;
        } else if (mode === 'delete') {
            if (sessionStorage.getItem('hospitais') == '[]') {
                const alert = await this.alertController.create({
                    header: `Não há hospitais cadastrados para deletar!`,
                    buttons: [
                        { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
                    ],
                });
                await alert.present();
                return;
            }
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

    //VISUALIZAÇÃO E FECHAMENTO DO MODAL DO MAPA DO HOSPITAL
    viewHospitalOnMap(hospital: HospitalProcessado) {
        if (this.isEditingMode || this.isDeletingMode) return;

        this.selectedHospital = hospital;
        this.isModalOpenMap = true;
        console.log(this.selectedHospital)
    }
    closeHospitalOnMap() {
        this.isModalOpenMap = false;
    }

    openLocationSelectionModal() {

        // 1. Caso de EDIÇÃO (o hospital já tem coordenadas):
        if (this.isModalOpenEdit && this.selectedHospital) {
            this.tempLatitude = this.selectedHospital.lati;
            this.tempLongi = this.selectedHospital.longi; // Inicializa com as coordenadas do hospital
        }
        // 2. Caso de ADIÇÃO (o hospital NÃO existe):
        // Se isModalOpenEdit for false, e tempLatitude/tempLongi JÁ tiverem valores
        // (vindos do getCurrentLocation() chamado em setOpenAdd), NADA é feito, mantendo o GPS.
        else if (this.tempLatitude === null || this.tempLongi === null) {
            // Se isModalOpenEdit for false E as coordenadas NÃO estiverem setadas, 
            // tenta obter o GPS como fallback, ou zera (para evitar NaN).
            this.getCurrentLocation();
        }


        this.isModalOpenLocationSelect = true;
    }

    closeLocationSelectionModal() {
        this.isModalOpenLocationSelect = false;
    }



    saveSelectedLocation() {
        if (this.tempLatitude !== null && this.tempLongi !== null) { // 🚨 CORREÇÃO: Usando tempLong
            if (this.selectedHospital) {
                this.selectedHospital.lati = this.tempLatitude;
                this.selectedHospital.longi = this.tempLongi; // 🚨 CORREÇÃO: Usando tempLong
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

    onAddressInput(event: any) {
        const query = event.target.value;
        if (query && query.length > 2) {
            this.buscarLocalizacaoService.getAddresses(query).subscribe(
                (data) => {
                    // O serviço de buscarLocalizacaoService provavelmente usa Place Autocomplete,
                    // retornando descrições (predictions) e um place_id.
                    this.predictions = data.predictions || [];
                },
                (error) => {
                    console.error('Erro ao buscar endereços:', error);
                    this.predictions = [];
                }
            );
        } else {
            this.predictions = [];
        }
    }


    async selectPrediction(prediction: any) {
        this.predictions = []; // Fecha a lista de previsões

        // 1. Atualiza o input com o endereço completo
        this.enderecoManual = prediction.description;

        const loading = await this.loadingController.create({
            message: 'Localizando no mapa...'
        });
        await loading.present();

        try {

            const result: { lat: number, lng: number } = await firstValueFrom(
                this.buscarLocalizacaoService.getCoordsFromPlaceId(prediction.place_id) // Supondo que você tem um método no GeocodingService que resolve o place_id para coords.
            );


            this.tempLatitude = result.lat;
            this.tempLongi = result.lng;


            this.cd.detectChanges();



        } catch (error) {
            console.error('Erro ao geocodificar o endereço selecionado:', error);

        } finally {
            loading.dismiss();
        }
    }



    @ViewChild('inputRef') inputElement: ElementRef | undefined;
    @ViewChild('inputEnderecoRef') inputEnderecoRef: ElementRef | undefined;
    @ViewChild('inputHospitalRef') inputHospitalRef: ElementRef | undefined;

    limparInput(campo: 'enderecoManual' | 'nomeHospital') {
        let inputRef: ElementRef | undefined;

        if (campo === 'enderecoManual') {
            this.enderecoManual = '';
            inputRef = this.inputEnderecoRef;
        }
        else if (campo === 'nomeHospital') {
            this.nomeHospital = ''; // Alterado para null
            inputRef = this.inputHospitalRef;
        }

        // Retorna o foco
        if (inputRef && inputRef.nativeElement) {
            inputRef.nativeElement.focus();
        }
    }
}