import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouComponent } from './thank-you.component';

describe('ThankYouComponent', () => {
  let component: ThankYouComponent;
  let fixture: ComponentFixture<ThankYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      providers: [DatePipe, { provide: MAT_SNACK_BAR_DATA, useValue: {} }],
      declarations: [ ThankYouComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
