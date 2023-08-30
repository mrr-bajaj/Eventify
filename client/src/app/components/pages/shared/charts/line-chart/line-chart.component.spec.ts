import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';
import { Chart } from 'chart.js';
import { EventsService } from 'src/app/services/events/events.service';
import { BehaviorSubject } from 'rxjs';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  beforeEach(() => {
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', ['getLineDataEvent']);
    TestBed.configureTestingModule({
      declarations: [LineChartComponent],
      providers: [{ provide: EventsService, useValue: eventsServiceSpyObj }],
    });
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
