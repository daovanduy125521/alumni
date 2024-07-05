import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffDialogComponent } from './create-staff-dialog.component';

describe('CreateStaffDialogComponent', () => {
  let component: CreateStaffDialogComponent;
  let fixture: ComponentFixture<CreateStaffDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStaffDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
