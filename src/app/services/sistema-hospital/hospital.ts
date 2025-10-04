import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { EnderecoCompleto } from '../geocoding/geocoding.service'; // Opcional: Para tipagem

// --- Interfaces de Dados ---
// Define a estrutura de dados esperada do Backend ANTES de ser processada
export interface HospitalBackend {
    id: number;
    nome: string;
    lati: number | string; // 🚨 Aceita string para garantir a leitura do dado bruto
    longi: number | string; // 🚨 PADRONIZADO E aceita string
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    foto: { type: 'Buffer', data: number[] } | string | null;
    tempo_espera: number;
}

// Interface que reflete os dados processados para uso no frontend (Todos como NUMBER)
export interface HospitalProcessado {
    id: number;
    nome: string;
    lati: number; // Deve ser NUMBER
    longi: number; // 🚨 PADRONIZADO E deve ser NUMBER
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    foto: string | null;
    tempo_espera: number;
    distancia?: number;
    distanciaRota?: number;
    tempoDeslocamento?: number;
}

// --- Serviço ---
@Injectable({
    providedIn: 'root'
})
export class HospitalService {

    // ALERTA: Ajuste o endereço base da sua API
    private API_URL = 'https://projeto-integrador-backend-2025-senac.onrender.com/hospital';

    constructor(private http: HttpClient) { }

    // Simulação da localização do usuário (você deve obter isso via Geolocation do Capacitor)
    getLocalizacaoAtual() {
        // Exemplo de localização fixa para teste. Substitua pela lógica real do Geolocation.
        return { lat: -23.5505, lng: -46.6333 };
    }

    getAllHospitais(): Observable<HospitalProcessado[]> {
        return this.http.get<HospitalBackend[]>(`${this.API_URL}`).pipe(
            map(hospitais => hospitais.map(hospital => {

                // --- Lógica de conversão da foto (Base64) ---
                let fotoUrl: string | null = null;
                if (hospital.foto && typeof hospital.foto !== 'string' && (hospital.foto as any).data) {
                    const binary = new Uint8Array((hospital.foto as any).data);
                    let base64String = '';
                    binary.forEach(byte => { base64String += String.fromCharCode(byte); });
                    const base64Encoded = btoa(base64String);
                    fotoUrl = `data:image/jpeg;base64,${base64Encoded}`;
                } else if (typeof hospital.foto === 'string') {
                    fotoUrl = hospital.foto;
                }

                // 🚨 CORREÇÃO PRINCIPAL: Conversão forçada de string para number
                const rawLati = hospital.lati;
                const processedLati = rawLati ? Number(rawLati) : 0;

                const rawLongi = hospital.longi; // 🚨 Lendo de longi
                const processedLongi = rawLongi ? Number(rawLongi) : 0; // ✅ Corrigido: Converte longi para número

                if (isNaN(processedLati) || isNaN(processedLongi)) {
                    console.warn('Alerta: Coordenada inválida detectada e zerada.', hospital);
                }

                return {
                    ...hospital,
                    lati: isNaN(processedLati) ? 0 : processedLati,
                    longi: isNaN(processedLongi) ? 0 : processedLongi, // 🚨 Retorna longi como NUMBER
                    foto: fotoUrl
                } as HospitalProcessado;
            }))
        );
    }

    getHospital(id: number): Observable<HospitalProcessado> {
        return this.http.get<HospitalProcessado>(`${this.API_URL}/get-hospital`, { params: { id: id.toString() } });
    }


    addHospital(formData: FormData): Observable<any> {
        return this.http.post(`${this.API_URL}/add-hospital`, formData);
    }


    updateHospital(formData: FormData): Observable<any> {
        return this.http.post(`${this.API_URL}/update`, formData);
    }


    deleteHospital(id: number): Observable<any> {
        // 🚨 CORREÇÃO: Usa POST e envia o objeto { id: id } no body
        const body = { id: id };
        return this.http.post(`${this.API_URL}/delete-hospital`, body);
    }


    createFormData(hospitalData: Partial<HospitalBackend>, photoBase64: string | null, photoFilename: string = 'foto.jpeg'): FormData {
        const formData = new FormData();

        // 1. Anexar dados de texto (incluindo lati e longi)
        for (const key of Object.keys(hospitalData) as Array<keyof HospitalBackend>) {
            if (hospitalData[key] !== null && hospitalData[key] !== undefined) {
                formData.append(key, hospitalData[key]!.toString());
            }
        }

        // 2. Anexar o arquivo (se existir)
        if (photoBase64) {
            const base64Data = photoBase64.split(',')[1];
            const byteString = atob(base64Data);
            const mimeString = photoBase64.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });

            formData.append('foto', blob, photoFilename);
        }

        return formData;
    }
}

