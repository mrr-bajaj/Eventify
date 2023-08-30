import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  beforeEach(
    waitForAsync(() => {
      // Create a spy object for MatDialogRef
      const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MatDialogModule],
        providers: [{ provide: MatDialogRef, useValue: spyDialogRef }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    // Get the MatDialogRef from the TestBed
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ConfirmationDialogComponent>
    >;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close(true) on confirm()', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close(false) on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
