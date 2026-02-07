import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPickerModal } from './location-picker-modal';

describe('LocationPickerModal', () => {
  let component: LocationPickerModal;
  let fixture: ComponentFixture<LocationPickerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPickerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
