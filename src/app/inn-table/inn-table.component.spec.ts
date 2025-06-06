import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnTable } from './inn-table.component';

describe('InnTableComponent', () => {
  let component: InnTable;
  let fixture: ComponentFixture<InnTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
