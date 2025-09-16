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
  long: number;
  tempo_fila: number;
  qtd_pacientes: number;
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
  ) {}

  // ================== MÉTODOS PRINCIPAIS ================== //

  async inicializarComConfiguracoesSalvas(): Promise<LocalizacaoUsuario> {
    try {
      // Busca as configurações do localStorage
      const config = await this.obterConfiguracoesLocalStorage();
      
      if (config.LocalizacaoAtual === 'true') {
        // Usa geolocalização
        return await this.inicializarComLocalizacaoAtual();
      } else if (config.EnderecoManual && config.EnderecoManual !== 'false') {
        // Usa endereço manual
        return await this.inicializarComEndereco(config.EnderecoManual);
      } else {
        throw new Error('Nenhuma configuração de localização válida encontrada');
      }
    } catch (error) {
      console.error('Erro ao inicializar com configurações salvas:', error);
      throw error;
    }
  }

  async carregarHospitaisComConfiguracoesSalvas(): Promise<void> {
    try {
      // Obtém configurações e inicializa localização
      const config = await this.obterConfiguracoesLocalStorage();
      await this.inicializarComConfiguracoesSalvas();
      
      // Carrega hospitais com o raio salvo
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
        // Valida se tem a estrutura mínima esperada
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
      // 1. Verifica permissões
      await this.verificarPermissoes();

      // 2. Obtém a localização atual com Capacitor
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
      // Verifica se já tem permissão
      const permissionStatus = await Geolocation.checkPermissions();
      
      if (permissionStatus.location !== 'granted') {
        // Solicita permissão
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
      case 1: // PERMISSION_DENIED
      case 'PERMISSION_DENIED':
        return 'Permissão de localização negada. Ative nas configurações do seu dispositivo.';
      
      case 2: // POSITION_UNAVAILABLE
      case 'POSITION_UNAVAILABLE':
        return 'Localização indisponível. Verifique se o GPS está ativado.';
      
      case 3: // TIMEOUT
      case 'TIMEOUT':
        return 'Tempo esgotado para obter localização. Tente novamente.';
      
      default:
        return 'Erro ao obter localização. Tente novamente.';
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
      // 1. Busca TODOS os hospitais do backend
      const todosHospitais = await this.requisicaoService.get(
        '/hospital', 
        {}
      ).toPromise() as Hospital[];

      // 2. Formata endereço completo e calcula distância em linha reta
      const hospitaisComDistancia = todosHospitais.map(hospital => {
        const enderecoCompleto = this.formatarEndereco(hospital);
        const distancia = this.calcularDistancia(
          localizacao.lat, localizacao.lng, 
          hospital.lati, hospital.long
        );
        
        return { 
          ...hospital, 
          distancia,
          enderecoCompleto
        } as HospitalProcessado;
      }).filter(hospital => (hospital.distancia ?? Infinity) <= raioKm);

      // 3. Calcula rotas e tempos reais (máximo 10 hospitais para não sobrecarregar)
      const hospitaisParaCalcularRota = hospitaisComDistancia.slice(0, 10);
      const hospitaisComRota = await this.calcularRotasETempos(
        hospitaisParaCalcularRota, 
        localizacao.lat, 
        localizacao.lng
      );

      // 4. Adiciona os hospitais restantes sem cálculo de rota
      const todosHospitaisProcessados = [
        ...hospitaisComRota,
        ...hospitaisComDistancia.slice(10).map(h => ({ ...h, tempoDeslocamento: undefined, distanciaRota: undefined }))
      ];

      // 5. Ordena por proximidade (distância em linha reta) e depois por tempo de fila
      todosHospitaisProcessados.sort((a, b) => {
        // Primeiro por distância - trata valores undefined como infinito
        const distA = a.distancia ?? Infinity;
        const distB = b.distancia ?? Infinity;
        
        if (distA !== distB) {
          return distA - distB;
        }
        // Depois por tempo de fila se as distâncias forem iguais
        return a.tempo_fila - b.tempo_fila;
      });

      // 6. Emite os dados processados
      this.hospitaisFiltradosSource.next(todosHospitaisProcessados);

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
        const destino = new google.maps.LatLng(hospital.lati, hospital.long);
        
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

  // Método para verificar se existem configurações salvas
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
