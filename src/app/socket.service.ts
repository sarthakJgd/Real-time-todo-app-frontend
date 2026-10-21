import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import io from "socket.io-client";
import { HttpClient } from "@angular/common/http";
import { Observable, observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: "root"
})
export class SocketService {
  private baseUrl = environment.apiBaseUrl;
  private socket; 
  constructor(private http: HttpClient, private cookie: CookieService) {
    this.socket = io(this.baseUrl);
    this.socket.on("connect", () => {
      this.socket.emit("set-user", this.cookie.get("authtoken"));
    });
    this.socket.on("auth-error", () => this.socket.disconnect());
  }

  onGetNotification(data: any) {
    this.socket.emit("getNotification", data);
  }

  onShow() {
    let observable = new Observable<any>(observer => {
      this.socket.on("showToall", data => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
