import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnTableCellComponent } from './inn-table-cell.component';

describe('InnTableCellComponent', () => {
  let component: InnTableCellComponent;
  let fixture: ComponentFixture<InnTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnTableCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
