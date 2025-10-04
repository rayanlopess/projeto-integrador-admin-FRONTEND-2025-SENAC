import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Estrutura do objeto de endereço que será retornada
export interface EnderecoCompleto {
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string; // Inclui rua e número
}

// ⚠️ ATENÇÃO: Substitua pela sua chave REAL da Google Maps Platform
const GOOGLE_API_KEY = 'AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI'; 
const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }

  /**
   * Converte Latitude e Longitude em um objeto de endereço formatado.
   * Usa firstValueFrom para permitir o uso de async/await.
   * @param lat Latitude
   * @param lng Longitude
   * @returns Promise com o EnderecoCompleto
   */
  async getAddressFromCoords(lat: number, longi: number): Promise<EnderecoCompleto> {
    // Adiciona o parâmetro language=pt-BR para garantir resultados em Português (melhora a formatação)
    const url = `${GEOCODING_URL}?latlng=${lat},${longi}&key=${GOOGLE_API_KEY}&language=pt-BR`;

    try {
      // Converte o Observable em Promise, usando firstValueFrom
      const response: any = await firstValueFrom(this.http.get(url));

      // 🌟 MELHORIA DE DEBUG: Verifica o status exato da API do Google
      if (response.status !== 'OK') {
        // Lança um erro mais específico contendo o status retornado pela API
        throw new Error(`A API do Google retornou o status: ${response.status}. Possíveis causas: chave inválida, faturamento desativado ou API não habilitada.`);
      }

      if (!response.results || response.results.length === 0) {
        throw new Error('As coordenadas não correspondem a um endereço conhecido (ZERO_RESULTS).');
      }

      // 1. Extrai os componentes do endereço do primeiro resultado
      const components = response.results[0].address_components;
      
      // 2. Funções auxiliares para encontrar componentes específicos
      const findComponent = (type: string, format: 'short_name' | 'long_name' = 'long_name') => {
        const component = components.find((c: any) => c.types.includes(type));
        return component ? component[format] : null;
      };

      // 3. Obtém os dados obrigatórios para o seu modelo
      // administrative_area_level_1 (Estado)
      const uf = findComponent('administrative_area_level_1', 'short_name') || 'N/A';
      // locality (Cidade) ou administrative_area_level_2 (Município, se a localidade não for encontrada)
      const cidade = findComponent('locality') || findComponent('administrative_area_level_2') || 'N/A';
      // sublocality (Bairro) ou neighborhood (Vizinhaça)
      const bairro = findComponent('sublocality') || findComponent('neighborhood') || 'N/A';
      
      const rua = findComponent('route');
      const numero = findComponent('street_number');
      
      const logradouro = `${rua || 'Rua Desconhecida'}${numero ? ', ' + numero : ' s/n'}`;

      // 4. Retorna o objeto completo
      const endereco: EnderecoCompleto = { uf, cidade, bairro, logradouro };
      
      console.log('Endereço obtido:', endereco);
      return endereco;

    } catch (error: any) {
      // Captura o erro customizado ou o erro de rede
      console.error('Falha ao buscar endereço pelas coordenadas:', error.message);
      // Re-lança um erro genérico para o componente Home
      throw new Error(`Falha na Geocodificação Reversa. Detalhes: ${error.message}`);
    }
  }
}
