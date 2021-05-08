import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceVehicleComponent } from './space-vehicle.component';

describe('SpaceVehicleComponent', () => {
  let component: SpaceVehicleComponent;
  let fixture: ComponentFixture<SpaceVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
