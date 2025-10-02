// src/app/services/sistema-hospital/hospital.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces de Dados ---
// Define a estrutura de dados esperada do Backend ANTES de ser processada
export interface HospitalBackend {
    id: number;
    nome: string;
    lati: number; 
    longi: number;
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    foto: string | null; // URL ou nome do arquivo
    tempo_espera: number; // Em minutos
}

// Define a estrutura de dados APÓS o processamento (ex: cálculo de rota/distância)
export interface HospitalProcessado extends HospitalBackend {
    distancia?: number; // Distância em linha reta (simulada ou calculada)
    distanciaRota?: number; // Distância calculada via API de rotas
    tempoDeslocamento?: number; // Tempo de deslocamento (em minutos)
}

// --- Serviço ---
@Injectable({
  providedIn: 'root'
})
export class HospitalService{

    // ALERTA: Ajuste o endereço base da sua API
    private API_URL = 'http://localhost:3000/hospitais'; 

    constructor(private http: HttpClient) { }

    // Simulação da localização do usuário (você deve obter isso via Geolocation do Capacitor)
    getLocalizacaoAtual() {
        // Exemplo de localização fixa para teste. Substitua pela lógica real do Geolocation.
        return { lat: -23.5505, lng: -46.6333 }; 
    }

    /**
     * Rota: router.get("/all")
     * Obtém a lista de todos os hospitais.
     */
    getAllHospitais(): Observable<HospitalProcessado[]> {
        // O backend deve retornar uma lista de HospitalProcessado, talvez com os campos de distância/tempo já calculados ou nulos.
        return this.http.get<HospitalProcessado[]>(`${this.API_URL}/all`);
    }

    /**
     * Rota: router.get("/get-hospital")
     * Obtém um único hospital por ID (ou outro critério).
     */
    getHospital(id: number): Observable<HospitalProcessado> {
        // Assumindo que o endpoint aceite um ID via query param
        return this.http.get<HospitalProcessado>(`${this.API_URL}/get-hospital`, { params: { id: id.toString() } });
    }

    /**
     * Rota: router.post("/add-hospital", upload.single("foto"))
     * Adiciona um novo hospital, incluindo o envio de um arquivo de foto.
     */
    addHospital(formData: FormData): Observable<any> {
        // O FormData deve incluir o campo 'foto' com o arquivo, além de outros campos de texto
        return this.http.post(`${this.API_URL}/add-hospital`, formData);
    }

    /**
     * Rota: router.post("/update", upload.single("foto"))
     * Atualiza um hospital existente.
     */
    updateHospital(formData: FormData): Observable<any> {
        // O FormData deve incluir o ID do hospital e os dados a serem atualizados
        return this.http.post(`${this.API_URL}/update`, formData);
    }

    /**
     * Rota: router.delete("/delete-hospital")
     * Exclui um hospital por ID.
     */
    deleteHospital(id: number): Observable<any> {
        // Assumindo que o endpoint aceite o ID via query param
        return this.http.delete(`${this.API_URL}/delete-hospital`, { params: { id: id.toString() } });
    }

    // --- Métodos Auxiliares ---
    
    /**
     * Converte o Base64 da imagem e os dados do formulário para FormData.
     * @param hospitalData Os dados de texto (nome, lat, long, etc.)
     * @param photoBase64 A string Base64 da foto (do Capacitor)
     * @param photoFilename O nome do arquivo (ex: 'hospital_123.jpg')
     */
    createFormData(hospitalData: Partial<HospitalBackend>, photoBase64: string | null, photoFilename: string = 'foto.jpeg'): FormData {
      const formData = new FormData();

      // 1. Anexar dados de texto
      // CORREÇÃO APLICADA: Usamos Object.keys e forçamos a tipagem da chave
      for (const key of Object.keys(hospitalData) as Array<keyof HospitalBackend>) {
          // Verifica se a propriedade tem um valor e não é nula/undefined
          if (hospitalData[key] !== null && hospitalData[key] !== undefined) {
              // Converte tudo para string para o FormData
              // O '!' garante que o valor existe neste ponto
              formData.append(key, hospitalData[key]!.toString()); 
          }
      }

      // 2. Anexar o arquivo (se existir)
      if (photoBase64) {
          // Converte Base64 para Blob (necessário para upload como "file")
          // Ignoramos a primeira parte "data:image/jpeg;base64,"
          const base64Data = photoBase64.split(',')[1];
          const byteString = atob(base64Data);
          const mimeString = photoBase64.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          
          // O nome do campo 'foto' deve bater com o `upload.single("foto")` do backend
          formData.append('foto', blob, photoFilename);
      }

      return formData;
  }

}