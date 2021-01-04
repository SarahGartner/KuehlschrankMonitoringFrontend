import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeSensordataComponent } from './fridge-sensordata.component';

describe('FridgeSensordataComponent', () => {
  let component: FridgeSensordataComponent;
  let fixture: ComponentFixture<FridgeSensordataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FridgeSensordataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeSensordataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
