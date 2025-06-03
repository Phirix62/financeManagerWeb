import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';

describe('AuthService', () => {
    let service: AuthService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let routerSpy: jasmine.SpyObj<Router>;
    let messageSpy: jasmine.SpyObj<NzMessageService>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        messageSpy = jasmine.createSpyObj('NzMessageService', ['success']);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: HttpClient, useValue: httpClientSpy },
                { provide: Router, useValue: routerSpy },
                { provide: NzMessageService, useValue: messageSpy }
            ]
        });
        service = TestBed.inject(AuthService);
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call http.post on register', () => {
        const user = { username: 'test', password: 'pass' };
        httpClientSpy.post.and.returnValue(of({}));
        service.register(user).subscribe();
        expect(httpClientSpy.post).toHaveBeenCalledWith('http://localhost:8080/api/users/register', user);
    });

    it('should call http.post on login', () => {
        const user = { username: 'test', password: 'pass' };
        httpClientSpy.post.and.returnValue(of({}));
        service.login(user).subscribe();
        expect(httpClientSpy.post).toHaveBeenCalledWith('http://localhost:8080/api/users/login', user);
    });

    it('should clear localStorage, show message and navigate on logout', () => {
        spyOn(localStorage, 'clear');
        service.logout();
        expect(localStorage.clear).toHaveBeenCalled();
        expect(messageSpy.success).toHaveBeenCalledWith('Logged out successfully!', { nzDuration: 5000 });
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
    });

    it('should return true if currentUser exists in localStorage', () => {
        localStorage.setItem('currentUser', JSON.stringify({ username: 'test' }));
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if currentUser does not exist in localStorage', () => {
        localStorage.removeItem('currentUser');
        expect(service.isLoggedIn()).toBeFalse();
    });

    it('should save currentUser to localStorage', () => {
        const user = { username: 'test' };
        service.saveCurrentUser(user);
        expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(user));
    });

    it('should get currentUser from localStorage', () => {
        const user = { username: 'test' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        expect(service.getCurrentUser()).toEqual(user);
    });

    it('should return null if currentUser not in localStorage', () => {
        localStorage.removeItem('currentUser');
        expect(service.getCurrentUser()).toBeNull();
    });
});