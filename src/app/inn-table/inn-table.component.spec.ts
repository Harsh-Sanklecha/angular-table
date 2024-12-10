import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnTableComponent } from './inn-table.component';

describe('InnTableComponent', () => {
  let component: InnTableComponent;
  let fixture: ComponentFixture<InnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
