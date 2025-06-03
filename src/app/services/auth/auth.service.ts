import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

const BASIC_URL = 'http://localhost:8080/';

/**
 * AuthService handles user authentication, registration, and session management.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private router: Router,
        private message: NzMessageService
    ) { }

    /**
     * Registers a new user.
     * @param user User registration data.
     * @returns Observable of the HTTP response.
     */
    register(user: any): Observable<any> {
        console.log('Registering user:', user);
        return this.http.post(BASIC_URL + 'api/users/register', user);
    }

    /**
     * Logs in a user.
     * @param user User login credentials.
     * @returns Observable of the HTTP response.
     */
    login(user: any): Observable<any> {
        console.log('Logging in user:', user);
        return this.http.post(BASIC_URL + 'api/users/login', user);
    }

    /**
     * Logs out the current user, clears local storage, shows a message, and navigates to the home page.
     */
    logout() {
        console.log('Logging out user');
        localStorage.clear();
        this.message.success('Logged out successfully!', {
            nzDuration: 5000,
        });
        this.router.navigateByUrl('');
    }

    /**
     * Checks if a user is currently logged in.
     * @returns True if a user is logged in, false otherwise.
     */
    isLoggedIn(): boolean {
        const user = localStorage.getItem('currentUser');
        const loggedIn = user !== null;
        console.log('Is user logged in?', loggedIn);
        return loggedIn;
    }

    /**
     * Saves the current user to local storage.
     * @param user The user object to save.
     */
    saveCurrentUser(user: any): void {
        console.log('Saving current user:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    /**
     * Retrieves the current user from local storage.
     * @returns The current user object or null if not found.
     */
    getCurrentUser(): any | null {
        const user = localStorage.getItem('currentUser');
        const parsedUser = user ? JSON.parse(user) : null;
        console.log('Retrieved current user:', parsedUser);
        return parsedUser;
    }
}
