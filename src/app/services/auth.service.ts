import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { first, catchError, tap } from "rxjs/operators";
import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://social-app-backend-e7y1.onrender.com/auth";
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  private loginLoadingSubject = new BehaviorSubject<boolean>(false); // Estado de carga para login
  private signupLoadingSubject = new BehaviorSubject<boolean>(false); // Estado de carga para signup
  userId: number; // Cambia aquí el tipo a número
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
    this.checkLoginStatus();
  }

  signup(user: Omit<User, "id">): Observable<User> {
    this.signupLoadingSubject.next(true); // Inicia el estado de carga
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        tap(() => {
          this.signupLoadingSubject.next(false); // Termina el estado de carga
        }),
        catchError((error) => {
          this.signupLoadingSubject.next(false); // Termina el estado de carga en caso de error
          return this.errorHandlerService.handleError<User>("signup")(error);
        })
      );
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{ token: string; userId: number }> {
    this.loginLoadingSubject.next(true); // Inicia el estado de carga para login
    return this.http
      .post<{ token: string; userId: number }>(
        `${this.url}/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        first(),
        tap((tokenObject) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          localStorage.setItem("userId", tokenObject.userId.toString()); // Asegúrate de almacenar el userId como string
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["posts"]);
          this.loginLoadingSubject.next(false); // Termina el estado de carga
        }),
        catchError((error) => {
          this.loginLoadingSubject.next(false); // Termina el estado de carga en caso de error
          return this.errorHandlerService.handleError<{
            token: string;
            userId: number;
          }>("login")(error);
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    this.isUserLoggedIn$.next(false);
    this.router.navigate(["/login"]);
  }

  private checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Recupera el userId del localStorage
    if (token && userId) {
      this.isUserLoggedIn$.next(true);
      this.userId = Number(userId); // Convierte el string a número y asigna a userId
    }
  }
  isLoading(type: 'login' | 'signup'): Observable<boolean> {
    if (type === 'login') {
      return this.loginLoadingSubject.asObservable();
    } else {
      return this.signupLoadingSubject.asObservable();
    }
  }
}
