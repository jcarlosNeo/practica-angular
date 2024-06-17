import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const validEmail = 'jcarlos9@ejemplo.com';
      const validPassword = '12345678';

      if (email === validEmail && password === validPassword) {
        localStorage.setItem('authToken', 'some-token');
        resolve();
      } else {
        reject('Usuario o contraseña incorrecta');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}