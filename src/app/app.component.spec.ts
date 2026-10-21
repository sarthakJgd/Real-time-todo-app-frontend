import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      providers: [DatePipe, { provide: MAT_SNACK_BAR_DATA, useValue: {} }],
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'LiveToDoApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('LiveToDoApp');
  });

  it('should render the route outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
