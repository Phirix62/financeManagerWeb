import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;
  const BASIC_URL = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatsService]
    });
    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getStats with correct URL', () => {
    const userId = 123;
    const mockResponse = { data: 'test' };

    service.getStats(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(BASIC_URL + 'api/stats/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getChart with correct URL', () => {
    const userId = 456;
    const mockResponse = { chart: [1, 2, 3] };

    service.getChart(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(BASIC_URL + 'api/stats/' + userId + '/chart');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
