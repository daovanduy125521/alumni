import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalAlumniComponent } from './approval-alumni.component';

describe('ApprovalAlumniComponent', () => {
  let component: ApprovalAlumniComponent;
  let fixture: ComponentFixture<ApprovalAlumniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalAlumniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalAlumniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
