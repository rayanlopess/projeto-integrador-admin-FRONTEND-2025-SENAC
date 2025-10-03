import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { lastValueFrom } from 'rxjs';

// Interface para o modelo de dados do Usuário (mantida)
export interface UserApiResponse {
    id: number;
    usuario: string; // Mapeia para nomeUsuario ou nomeCompleto
    email: string;
    senha: string;
    cpf: string;
    data_nasc?: string | null; // Adicionei data_nasc, se for o campo de data
    // Adicione outros campos do seu JSON aqui
}

// Sua interface de domínio/frontend (mantida)
export interface User {
    id: number;
    nomeCompleto: string;
    dataNascimento: string | null;
    cpf: string;
    email: string;
    nomeUsuario: string; 
    senha: string;
}
export function mapUserToDomain(apiUser: UserApiResponse): User {
    return {
        id: apiUser.id,
        nomeCompleto: apiUser.usuario, // Mapeando 'usuario' para 'nomeCompleto'
        nomeUsuario: apiUser.usuario, // Mapeando 'usuario' para 'nomeUsuario'
        dataNascimento: apiUser.data_nasc || null, // Mapeando campo de data do backend (ajuste se o nome for outro)
        cpf: apiUser.cpf,
        email: apiUser.email,
        senha: apiUser.senha // A senha provavelmente é um hash e só está no backend, mas mantemos o campo
    };
}
@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    // As rotas agora são específicas do seu backend
    private getAllUsersEndpoint = '/user'; 
    private addUserEndpoint = '/add-user';
    private updateUserEndpoint = '/user/update-user';

    constructor(private reqService: RequiemDosDeusesService) { }

// ----------------------------------------------------------------------
// READ (Leitura)
// ----------------------------------------------------------------------

    /**
     * Busca todos os usuários do backend (GET /all).
     * @returns Uma Promise que resolve para um array de User.
     */
    async getAllUsers(): Promise<User[]> {
    const observable = this.reqService.get(this.getAllUsersEndpoint, {});
    
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

    /**
     * Cria um novo usuário (POST /add-user).
     * @param userData Os dados do novo usuário (sem ID).
     * @returns Uma Promise que resolve para o User criado (ou a resposta do servidor).
     */
    async createUser(userData: Omit<User, 'id'>): Promise<any> {
        // Se a senha estiver vazia, deve ser tratada no backend ou aqui, mas vamos enviar os dados completos
        const observable = this.reqService.post(this.addUserEndpoint, userData);
        return lastValueFrom(observable); // Retorna a resposta completa do POST (sucesso/erro)
    }

// ----------------------------------------------------------------------
// UPDATE (Atualização)
// ----------------------------------------------------------------------

    /**
     * Atualiza um usuário existente (POST /update-user).
     * @param user O objeto User completo com ID para atualização.
     * @returns Uma Promise que resolve para o User atualizado (ou a resposta do servidor).
     */
    async updateUser(user: User): Promise<any> {
        // ATENÇÃO: Se a senha estiver vazia, você deve tratar se o backend espera um campo 'senha'
        // ou se ele apenas a ignora. Aqui, estamos enviando o objeto 'user' completo.

        // Usa o método POST do RequiemDosDeusesService na rota /update-user.
        const observable = this.reqService.post(this.updateUserEndpoint, user);
        return lastValueFrom(observable); // Retorna a resposta completa do POST
    }

// ----------------------------------------------------------------------
// DELETE (Exclusão - Standby)
// ----------------------------------------------------------------------

    /**
     * Exclui um usuário (Em Standby).
     * @param id O ID do usuário a ser excluído.
     * @returns Uma Promise vazia (void).
     */
    async deleteUser(id: number): Promise<void> {
        // Mantido em standby, lançando um erro para indicar que o endpoint ainda não existe.
        return new Promise((_, reject) => {
             reject(new Error("A rota de exclusão de usuário ainda não está implementada no backend."));
        });
        
        /*
        // Quando for implementar, provavelmente será um POST ou DELETE para uma rota como:
        // const observable = this.reqService.post('/delete-user', { userId: id }); 
        // await lastValueFrom(observable);
        */
    }
}