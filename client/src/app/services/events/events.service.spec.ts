import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService],
    });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add event', () => {
    const event = { name: 'Test Event' };
    const eventId = 'test-event-id';

    service.addEvent(event).subscribe((response) => {
      expect(response).toEqual(eventId);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/add-event`);
    expect(req.request.method).toBe('POST');
    req.flush(eventId);
  });

  it('should edit event', () => {
    const eventId = 'test-event-id';
    const event = { name: 'Updated Event' };

    service.editEvent(eventId, event).subscribe((response) => {
      expect(response).toEqual(eventId);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/edit-event/${eventId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(eventId);
  });

  it('should delete event', () => {
    const eventId = 'test-event-id';

    service.deleteEvent(eventId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/delete-event/${eventId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should add registration', () => {
    const eventId = 'test-event-id';
    const email = 'test@example.com';
    const response = { message: 'Registration successful' };

    service.addRegistration(email, eventId).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/register/${eventId}`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should add attendance', () => {
    const eventId = 'test-event-id';
    const email = 'test@example.com';
    const time = '08:30';
    const response = { message: 'Attendance recorded' };

    service.addAttendance(email, eventId).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/attendance/${eventId}`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should get attendance', () => {
    const eventId = 'test-event-id';
    const attendanceData = { event: 'Test Event', employees: [{ name: 'John Doe' }, { name: 'Jane Doe' }] };

    service.getAttendance(eventId).subscribe((result) => {
      expect(result).toEqual(attendanceData);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/attendance/${eventId}`);
    expect(req.request.method).toBe('GET');
    req.flush(attendanceData);
  });

  it('should get registration', () => {
    const eventId = 'test-event-id';
    const registrationData = { event: 'Test Event', employees: [{ name: 'John Doe' }, { name: 'Jane Doe' }] };

    service.getRegistration(eventId).subscribe((result) => {
      expect(result).toEqual(registrationData);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/register/${eventId}`);
    expect(req.request.method).toBe('GET');
    req.flush(registrationData);
  });
});
