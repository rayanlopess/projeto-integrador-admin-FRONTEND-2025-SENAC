import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Navigation {
  private _shouldRefreshMap: boolean = false;

  constructor() { }

  set shouldRefreshMap(value: boolean) {
    this._shouldRefreshMap = value;
  }

  get shouldRefreshMap(): boolean {
    return this._shouldRefreshMap;
  }
}