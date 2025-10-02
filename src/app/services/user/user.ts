import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { lastValueFrom } from 'rxjs';

// Interface para o modelo de dados do Usuário (mantida)
export interface User {
    id: number;
    nomeCompleto: string;
    dataNascimento: string | null;
    cpf: string;
    email: string;
    nomeUsuario: string;
    senha: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    // As rotas agora são específicas do seu backend
    private getAllUsersEndpoint = '/all'; 
    private addUserEndpoint = '/add-user';
    private updateUserEndpoint = '/update-user';

    constructor(private reqService: RequiemDosDeusesService) { }

// ----------------------------------------------------------------------
// READ (Leitura)
// ----------------------------------------------------------------------

    /**
     * Busca todos os usuários do backend (GET /all).
     * @returns Uma Promise que resolve para um array de User.
     */
    async getAllUsers(): Promise<User[]> {
        // Usa o método GET do RequiemDosDeusesService na rota /all.
        const observable = this.reqService.get(this.getAllUsersEndpoint, {});
        
        return lastValueFrom(observable) as Promise<User[]>;
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