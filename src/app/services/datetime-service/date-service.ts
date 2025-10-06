// services/date-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  // Retorna a data atual completa
  getCurrentDate(): Date {
    return new Date();
  }

  // Retorna o dia do mês (1-31)
  getCurrentDay(): number {
    return new Date().getDate();
  }

  // Retorna o dia da semana em português (ex: "Segunda-feira")
  getCurrentWeekday(): string {
    const daysOfWeek = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 
      'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return daysOfWeek[new Date().getDay()];
  }

  // Retorna o dia da semana abreviado (ex: "Seg")
  getCurrentWeekdayShort(): string {
    const daysOfWeekShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return daysOfWeekShort[new Date().getDay()];
  }

  // Retorna o mês em português (ex: "Janeiro")
  getCurrentMonth(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[new Date().getMonth()];
  }

  // Retorna o mês abreviado (ex: "Jan")
  getCurrentMonthShort(): string {
    const monthsShort = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return monthsShort[new Date().getMonth()];
  }

  // Retorna o número do mês (1-12)
  getCurrentMonthNumber(): number {
    return new Date().getMonth() + 1;
  }

  // Retorna o ano atual
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Retorna a data formatada (ex: "Segunda-feira, 25 de Dezembro de 2023")
  getFormattedDate(): string {
    const weekday = this.getCurrentWeekdayShort();
    const day = this.getCurrentDay();
    const month = this.getCurrentMonth();

    
    return `${weekday}, ${day} de ${month}`;
  }

  // Retorna a data formatada resumida (ex: "25/12/2023")
  getFormattedDateShort(): string {
    const day = this.getCurrentDay().toString().padStart(2, '0');
    const month = (this.getCurrentMonthNumber()).toString().padStart(2, '0');
    const year = this.getCurrentYear();
    
    return `${year}-${month}-${day}`;
  }

  // Retorna a data com hora formatada (ex: "25/12/2023 14:30")
  getFormattedDateTime(): string {
    const date = this.getFormattedDateShort();
    const time = this.getFormattedTime();
    
    return `${date} ${time}`;
  }

  // Retorna a hora formatada (ex: "14:30:45")
  getFormattedTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  // Verifica se é fim de semana
  isWeekend(): boolean {
    const dayOfWeek = new Date().getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Domingo, 6 = Sábado
  }

  // Verifica se é dia útil
  isWeekday(): boolean {
    return !this.isWeekend();
  }

  // Retorna informações completas da data
  getDateInfo() {
    return {
      date: this.getCurrentDate(),
      day: this.getCurrentDay(),
      weekday: this.getCurrentWeekday(),
      weekdayShort: this.getCurrentWeekdayShort(),
      month: this.getCurrentMonth(),
      monthShort: this.getCurrentMonthShort(),
      monthNumber: this.getCurrentMonthNumber(),
      year: this.getCurrentYear(),
      formattedDate: this.getFormattedDate(),
      formattedDateShort: this.getFormattedDateShort(),
      formattedDateTime: this.getFormattedDateTime(),
      isWeekend: this.isWeekend(),
      isWeekday: this.isWeekday()
    };
  }
}