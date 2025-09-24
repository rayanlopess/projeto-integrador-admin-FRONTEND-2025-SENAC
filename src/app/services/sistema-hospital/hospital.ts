import { Injectable, NgZone } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { BehaviorSubject } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

export interface Hospital {
  id: number;
  nome: string;
  uf: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  lati: number;
  longi: number;
  tempo_espera: number;
}

export interface HospitalProcessado extends Hospital {
  distancia?: number;
  tempoDeslocamento?: number;
  distanciaRota?: number;
  enderecoCompleto?: string;
}

export interface LocalizacaoUsuario {
  lat: number;
  lng: number;
  endereco?: string;
}

export interface ConfiguracoesUsuario {
  Distancia: number;
  EnderecoManual: string;
  LocalizacaoAtual: string;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  private hospitaisFiltradosSource = new BehaviorSubject<HospitalProcessado[]>([]);
  hospitaisFiltrados$ = this.hospitaisFiltradosSource.asObservable();

  private localizacaoUsuarioSource = new BehaviorSubject<LocalizacaoUsuario | null>(null);
  localizacaoUsuario$ = this.localizacaoUsuarioSource.asObservable();

  constructor(
    private requisicaoService: RequiemDosDeusesService,
    private ngZone: NgZone
  ) { }

  private raioChangedSubject = new BehaviorSubject<number>(this.getRaioConfigurado());
  public raioChanged$ = this.raioChangedSubject.asObservable();

  setRaioConfigurado(raio: number) {
    localStorage.setItem('raioKm', raio.toString());
    this.raioChangedSubject.next(raio);
  }

  getRaioConfigurado(): number {
    const raio = localStorage.getItem('raioKm');
    return raio ? parseInt(raio, 10) : 10;
  }

  getConfiguracoes(): ConfiguracoesUsuario | null {
    try {
      const configStr = localStorage.getItem('configuracoesUsuario');
      if (configStr) {
        return JSON.parse(configStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Método para obter hospitais processados
  getHospitaisProcessados(): HospitalProcessado[] {
    return this.hospitaisFiltradosSource.value;
  }

  // Método para obter hospitais básicos (sem processamento)
  async getTodosHospitais(): Promise<Hospital[]> {
    try {
      const todosHospitais = await this.requisicaoService.get(
        '/hospital',
        {}
      ).toPromise() as any[];

      return todosHospitais.map(hospital => ({
        id: hospital.id,
        nome: hospital.nome,
        uf: hospital.uf,
        cidade: hospital.cidade,
        logradouro: hospital.logradouro,
        bairro: hospital.bairro,
        lati: parseFloat(hospital.lati as any),
        longi: parseFloat(hospital.longi as any),
   
      
        tempo_espera: hospital.tempo_espera
      }));
    } catch (error) {
      console.error('Erro ao buscar hospitais:', error);
      return [];
    }
  }

  // ================== MÉTODOS PRINCIPAIS ================== //

  async inicializarComConfiguracoesSalvas(): Promise<LocalizacaoUsuario> {
  try {
    const config = await this.obterConfiguracoesLocalStorage();

    if (config.LocalizacaoAtual === 'true') {
      return await this.inicializarComLocalizacaoAtual();
    } else if (config.EnderecoManual) { 
      return await this.inicializarComEndereco(config.EnderecoManual);
    } else {
      throw new Error('Nenhuma configuração de localização válida encontrada');
    }
  } catch (error) {
    console.error('Erro ao inicializar com configurações salvas:', error);
    throw error;
  }
}

  // Este é o método que deve ser chamado para carregar todos os dados.
  // Ele agora orquestra a localização e o carregamento dos hospitais.
  async carregarHospitaisComConfiguracoesSalvas(): Promise<void> {
    try {
      // 1. Obtém as configurações do localStorage (Distancia, LocalizacaoAtual, etc.)
      const config = await this.obterConfiguracoesLocalStorage();

      // 2. Com base nas configurações, inicializa a localização do usuário.
      // Esta chamada atualiza o BehaviorSubject `localizacaoUsuarioSource`.
      const localizacaoUsuario = await this.inicializarComConfiguracoesSalvas();

      // 3. Atualiza o raio e notifica os ouvintes (como a MapaPage).
      this.setRaioConfigurado(config.Distancia);

      // 4. Carrega e processa os hospitais com base na localização e no raio.
      // Esta chamada atualiza o BehaviorSubject `hospitaisFiltradosSource`.
      await this.carregarHospitaisProximos(config.Distancia);

    } catch (error) {
      console.error('Erro ao carregar com configurações salvas:', error);
      throw error;
    }
  }

  private async obterConfiguracoesLocalStorage(): Promise<ConfiguracoesUsuario> {
    try {
      const configStr = localStorage.getItem('configuracoesUsuario');
      if (configStr) {
        const config = JSON.parse(configStr);
        if (config.Distancia && config.EnderecoManual !== undefined && config.LocalizacaoAtual !== undefined) {
          return config;
        }
      }
      throw new Error('Configurações não encontradas ou inválidas no localStorage');
    } catch (error) {
      console.error('Erro ao ler configurações:', error);
      throw new Error('Erro ao carregar configurações salvas');
    }
  }

  async inicializarComLocalizacaoAtual(): Promise<LocalizacaoUsuario> {
    try {
      await this.verificarPermissoes();

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const loc = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      this.ngZone.run(() => {
        this.localizacaoUsuarioSource.next(loc);
      });

      return loc;

    } catch (error: any) {
      console.error('Erro ao obter localização:', error);
      throw new Error(this.tratarErroGeolocalizacao(error));
    }
  }

  private async verificarPermissoes(): Promise<void> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();

        if (requestStatus.location !== 'granted') {
          throw new Error('Permissão de localização negada pelo usuário');
        }
      }
    } catch (error) {
      console.error('Erro nas permissões:', error);
      throw new Error('Não foi possível verificar as permissões de localização');
    }
  }

  private tratarErroGeolocalizacao(error: any): string {
    const errorCode = error.code || error.message;

    switch (errorCode) {
      case 1:
      case 'PERMISSION_DENIED':
        return 'Permissão de localização negada. Ative nas configurações do seu dispositivo.';
      case 2:
      case 'POSITION_UNAVAILABLE':
        return 'Localização indisponível. Verifique se o GPS está ativado.';
      case 3:
      case 'TIMEOUT':
        return 'Tempo esgotado para obter localização. Tente novamente.';
      default:
        return 'Erro ao obter localização. Trente novamente.';
    }
  }

  async inicializarComEndereco(endereco: string): Promise<LocalizacaoUsuario> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: endereco, componentRestrictions: { country: 'BR' } }, (results: any[], status: string) => {
        this.ngZone.run(() => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const loc = {
              lat: location.lat(),
              lng: location.lng(),
              endereco: results[0].formatted_address
            };

            this.localizacaoUsuarioSource.next(loc);
            resolve(loc);
          } else {
            reject(this.tratarErroGeocoding(status));
          }
        });
      });
    });
  }

  private tratarErroGeocoding(status: string): string {
    switch (status) {
      case 'ZERO_RESULTS':
        return 'Endereço não encontrado. Verifique se está correto.';
      case 'OVER_QUERY_LIMIT':
        return 'Limite de consultas excedido. Tente novamente mais tarde.';
      case 'REQUEST_DENIED':
        return 'Consulta ao serviço de geolocalização negada.';
      case 'INVALID_REQUEST':
        return 'Endereço inválido. Verifique os dados informados.';
      default:
        return `Erro ao processar endereço: ${status}`;
    }
  }

  async carregarHospitaisProximos(raioKm: number = 10): Promise<void> {
    const localizacao = this.localizacaoUsuarioSource.value;
    if (!localizacao) {
      throw new Error('Localização do usuário não definida');
    }
    
    try {
      const todosHospitais = await this.requisicaoService.get('/hospital', {}).toPromise() as any[];

      const hospitaisMapeados: Hospital[] = todosHospitais.map(hospital => ({
        id: hospital.id,
        nome: hospital.nome,
        uf: hospital.uf,
        cidade: hospital.cidade,
        logradouro: hospital.logradouro,
        bairro: hospital.bairro,
        lati: parseFloat(hospital.lati as any),
        longi: parseFloat(hospital.longi as any),
        qtd_pacientes: hospital.qtd_pacientes,
        tempo_espera: hospital.tempo_espera
      }));

      const hospitaisComDistanciaInicial = hospitaisMapeados.map(hospital => {
        const distancia = this.calcularDistancia(
          localizacao.lat, localizacao.lng,
          hospital.lati, hospital.longi
        );
        return {
          ...hospital,
          distancia,
        } as HospitalProcessado;
      }).filter(hospital => (hospital.distancia ?? Infinity) <= raioKm * 1.2);

      const hospitaisParaCalcularRota = hospitaisComDistanciaInicial.slice(0, 10);
      const hospitaisComRota = await this.calcularRotasETempos(
        hospitaisParaCalcularRota,
        localizacao.lat,
        localizacao.lng
      );

      const todosHospitaisProcessados = [
        ...hospitaisComRota,
        ...hospitaisComDistanciaInicial.slice(10).map(h => ({ 
          ...h, 
          tempoDeslocamento: undefined, 
          distanciaRota: undefined 
        }))
      ];

      const hospitaisFinais = todosHospitaisProcessados.filter(h => {
        const distanciaFinal = h.distanciaRota ?? h.distancia;
        return (distanciaFinal ?? Infinity) <= raioKm;
      });

      hospitaisFinais.sort((a, b) => {
        const distA = a.distancia ?? Infinity;
        const distB = b.distancia ?? Infinity;
        if (distA !== distB) {
          return distA - distB;
        }
        return a.tempo_espera - b.tempo_espera;
      });

      this.hospitaisFiltradosSource.next(hospitaisFinais);
    } catch (error) {
      console.error('Erro ao carregar hospitais:', error);
      this.hospitaisFiltradosSource.next([]);
      throw error;
    }
  }

  // ================== MÉTODOS AUXILIARES ================== //

  private formatarEndereco(hospital: Hospital): string {
    const parts = [hospital.logradouro, hospital.bairro, hospital.cidade, hospital.uf];
    return parts.filter(part => part && part.trim()).join(', ');
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private async calcularRotasETempos(hospitais: HospitalProcessado[], latOrigem: number, lngOrigem: number): Promise<HospitalProcessado[]> {
    const origem = new google.maps.LatLng(latOrigem, lngOrigem);
    const directionsService = new google.maps.DirectionsService();

    const promises = hospitais.map(async (hospital) => {
      try {
        const destino = new google.maps.LatLng(hospital.lati, hospital.longi);

        const result = await new Promise<any>((resolve, reject) => {
          directionsService.route({
            origin: origem,
            destination: destino,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            region: 'BR'
          }, (result: any, status: string) => {
            status === 'OK' ? resolve(result) : reject(status);
          });
        });

        const rota = result.routes[0].legs[0];
        return {
          ...hospital,
          tempoDeslocamento: Math.ceil(rota.duration.value / 60),
          distanciaRota: rota.distance.value / 1000
        };
      } catch (error) {
        console.warn(`Erro ao calcular rota para ${hospital.nome}:`, error);
        return hospital;
      }
    });

    return Promise.all(promises);
  }

  // ================== MÉTODOS ÚTEIS ================== //

  getLocalizacaoAtual(): LocalizacaoUsuario | null {
    return this.localizacaoUsuarioSource.value;
  }

  limparDados(): void {
    this.hospitaisFiltradosSource.next([]);
    this.localizacaoUsuarioSource.next(null);
  }

  async atualizarRaio(raioKm: number): Promise<void> {
    const localizacao = this.localizacaoUsuarioSource.value;
    if (localizacao) {
      await this.carregarHospitaisProximos(raioKm);
    }
  }

  temConfiguracoesSalvas(): boolean {
    try {
      const configStr = localStorage.getItem('configuracoesUsuario');
      if (configStr) {
        const config = JSON.parse(configStr);
        return !!(config.Distancia && (config.EnderecoManual !== undefined && config.LocalizacaoAtual !== undefined));
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}