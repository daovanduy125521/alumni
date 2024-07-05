import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniGroupComponent } from './alumni-group.component';

describe('AlumniGroupComponent', () => {
  let component: AlumniGroupComponent;
  let fixture: ComponentFixture<AlumniGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumniGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumniGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
