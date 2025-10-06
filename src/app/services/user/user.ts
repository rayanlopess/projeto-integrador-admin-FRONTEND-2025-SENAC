import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { lastValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

// Interface para o modelo de dados do Usuário 
export interface UserApiResponse {
    id: number;
    usuario: string; 
    email: string;
    senha: string;
    cpf: string;
    nascimento: string | null;
    nome: string
}

// Sua interface de domínio/frontend 
export interface User {
    id: number;
    nome: string;
    nascimento: string | null;
    cpf: string;
    email: string;
    usuario: string;
    senha: string;
}
export function mapUserToDomain(apiUser: UserApiResponse): User {
    const rawDate = apiUser.nascimento;

    let formattedNascimento: string | null = null;

    if (rawDate) {
        // Trunca para os 10 primeiros caracteres (YYYY-MM-DD)
        formattedNascimento = rawDate.substring(0, 10);
    }

    return {
        id: apiUser.id,
        nome: apiUser.nome,
        usuario: apiUser.usuario,
        // Aplica o formato truncado. Usa string vazia ('') se for null.
        nascimento: formattedNascimento || '', 
        cpf: apiUser.cpf,
        email: apiUser.email,
        senha: ''
    };
}
@Injectable({
    providedIn: 'root'
})
export class UserService {

    // As rotas agora são específicas do seu backend
    private getAllUsersEndpoint = '/user';
    private addUserEndpoint = '/user/add-user';
    private updateUserEndpoint = '/user/update-user';
    private deleteUserEndpoint = '/user/delete-user';

    constructor(private reqService: RequiemDosDeusesService) { }

    // ----------------------------------------------------------------------
    // READ (Leitura)
    // ----------------------------------------------------------------------
    async getAllUsers(token: any): Promise<User[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        const observable = this.reqService.get(this.getAllUsersEndpoint, { headers: headers });

        // 1. Resolve para o array (ou objeto de resposta) do backend
        const response = await lastValueFrom(observable) as UserApiResponse[] | { data: UserApiResponse[] };

        let apiUsers: UserApiResponse[];

        // Tenta identificar se o array está na propriedade 'data'
        if (Array.isArray(response)) {
            apiUsers = response; // Se a resposta for o array direto
        } else if (response && (response as any).data && Array.isArray((response as any).data)) {
            apiUsers = (response as any).data; // Se o array estiver em 'data'
        } else {
            return []; // Retorna array vazio se não conseguir encontrar os dados
        }

        // 2. Mapeia cada objeto da API para o formato esperado pelo frontend (User)
        return apiUsers.map(mapUserToDomain);
    }

    // ----------------------------------------------------------------------
    // CREATE (Criação)
    // ----------------------------------------------------------------------

    
    async createUser(userData: Omit<User, 'id'>, token: any): Promise<any> {
        

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        const observable = this.reqService.post(this.addUserEndpoint, userData, { headers: headers });
        return lastValueFrom(observable); 
    }


    async updateUser(user: User, token: any): Promise<any> {
     
        console.log(user)
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        const observable = this.reqService.post(this.updateUserEndpoint, user, { headers: headers });
        return lastValueFrom(observable); // Retorna a resposta completa do POST
    }

    
    async deleteUser(id: number, token: any): Promise<void> {

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    // CORREÇÃO: Enviar o ID encapsulado em um objeto JSON
    const payload = { 
        id: id // ou userId: id, dependendo do que o backend espera
    };

    console.log("Payload de deleção:", payload);

    // Envia o objeto 'payload' em vez do ID puro
    const observable = this.reqService.post(this.deleteUserEndpoint, payload, { headers: headers });
    
    // Como é um POST, o retorno é o que o lastValueFrom retorna, não 'void'.
    // Mantenha o Promise<void> se for apenas para indicar sucesso/falha.
    await lastValueFrom(observable); 
}
}