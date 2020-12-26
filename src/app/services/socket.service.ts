import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client/build/index';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  private url: string = environment.serverUrl;

  constructor() {}

  listen(event: string): Observable<any> {
    return new Observable((o) => {
      this.socket.on(event, (res: any) => o.next(res));
    });
  }

  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  connect(): void {
    this.socket = io(this.url);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
