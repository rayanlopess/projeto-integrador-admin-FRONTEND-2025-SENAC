import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Popover {
  private popoverRequestSource = new Subject<MouseEvent>();
  popoverRequest$ = this.popoverRequestSource.asObservable();

  requestPopover(event: MouseEvent) {
    this.popoverRequestSource.next(event);
  }
}
