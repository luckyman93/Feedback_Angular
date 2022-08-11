import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetModelComponent } from './sheet-model.component';

describe('SheetModelComponent', () => {
  let component: SheetModelComponent;
  let fixture: ComponentFixture<SheetModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
