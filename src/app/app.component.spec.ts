import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';

  beforeEach(() => TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, DemoNgZorroAntdModule],
      declarations: [AppComponent]
    }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'financeManagerWeb'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('financeManagerWeb');
  });
