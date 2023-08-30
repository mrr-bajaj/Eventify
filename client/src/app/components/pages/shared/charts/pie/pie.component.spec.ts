import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { of } from 'rxjs';
import { PieComponent } from './pie.component';
import { EventsService } from 'src/app/services/events/events.service';

describe('PieComponent', () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;
  let mockElementRef: jasmine.SpyObj<ElementRef>;
  let mockEventsService: jasmine.SpyObj<EventsService>;

  beforeEach(() => {
    mockElementRef = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    mockElementRef.nativeElement = { getContext: jasmine.createSpy('getContext') };

    mockEventsService = jasmine.createSpyObj('EventsService', ['getPieDataEvent']);
    mockEventsService.getPieDataEvent.and.returnValue(of(null));

    TestBed.configureTestingModule({
      declarations: [PieComponent],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
