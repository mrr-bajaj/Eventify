import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { SearchService } from 'src/app/services/search/search.service';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [FormsModule],
      providers: [SearchService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService); // Inject the SearchService

    // Clear any previous state or calls to the SearchService
    spyOn(searchService, 'sendSearchData'); // Spy on the sendSearchData method

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchTerm as an empty string', () => {
    expect(component.searchTerm).toEqual('');
  });

  it('should update searchTerm when the user enters text', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'test search';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTerm).toEqual('test search');
  });
});
