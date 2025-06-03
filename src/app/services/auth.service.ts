import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router, private message: NzMessageService) { }

    register(user: any): Observable<any> {
        return this.http.post(BASIC_URL + 'api/users/register', user);
    }

    login(user: any): Observable<any> {
        return this.http.post(BASIC_URL + 'api/users/login', user);
    }

    logout() {
    localStorage.clear();
    this.message.success('Logged out successfully!', {
      nzDuration: 5000,
    });
    this.router.navigateByUrl('');
    }

    isLoggedIn(): boolean {
        const user = localStorage.getItem('currentUser');
        return user !== null;
    }

    saveCurrentUser(user: any): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): any | null {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}
