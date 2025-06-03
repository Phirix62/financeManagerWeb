import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentSimulatorComponent } from './investment-simulator.component';

describe('InvestmentSimulatorComponent', () => {
  let component: InvestmentSimulatorComponent;
  let fixture: ComponentFixture<InvestmentSimulatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentSimulatorComponent]
    });
    fixture = TestBed.createComponent(InvestmentSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
