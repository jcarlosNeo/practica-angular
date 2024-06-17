import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.isUserLoggedIn(); // Implementa tu lógica de autenticación aquí

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  private isUserLoggedIn(): boolean {
    // Aquí debes implementar la lógica para verificar si el usuario está autenticado
    // Por ejemplo, podrías revisar si existe un token en el localStorage
    return !!localStorage.getItem('authToken');
  }
}