import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataCardComponent } from './data-card.component';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Mock the font-awesome icon component with a unique selector
@Component({ selector: 'fa-icon', template: '' })
class MockFaIconComponent {}

describe('DataCardComponent', () => {
  let component: DataCardComponent;
  let fixture: ComponentFixture<DataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataCardComponent], // Include the mock component in the declarations
      imports: [MatCardModule,FontAwesomeModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
