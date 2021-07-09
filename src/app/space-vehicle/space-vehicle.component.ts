import { Component, OnInit } from '@angular/core';
import { Planet } from '../models/Planet';
import { Vehicle } from '../models/Vehicle';
import { SpaceServiceService } from '../service/space-service.service';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ResponseToken } from '../models/ResponseToken';
import { FalconeResponse } from '../models/FalconeResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-vehicle',
  templateUrl: './space-vehicle.component.html',
  styleUrls: ['./space-vehicle.component.less'],
})
export class SpaceVehicleComponent implements OnInit {
  totalTimeTaken = 0;
  planetsArray: Array<Planet> = [];
  vehiclesArray: Array<Vehicle> = [];
  postToken = '';
  numericMap = new Map();
  spaceVehicleForm = this.fb.group({
    firstSpaceSelection: this.fb.group({
      firstPlanetSelect: ['', Validators.required],
      firstVehicleSelect: ['', Validators.required],
    }),
    secondSpaceSelection: this.fb.group({
      secondPlanetSelect: ['', Validators.required],
      secondVehicleSelect: ['', Validators.required],
    }),
    thirdSpaceSelection: this.fb.group({
      thirdPlanetSelect: ['', Validators.required],
      thirdVehicleSelect: ['', Validators.required],
    }),
    fourthSpaceSelection: this.fb.group({
      fourthPlanetSelect: ['', Validators.required],
      fourthVehicleSelect: ['', Validators.required],
    }),
  });

  constructor(
    private spaceService: SpaceServiceService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.numericMap.set(0, 'first');
    this.numericMap.set(1, 'second');
    this.numericMap.set(2, 'third');
    this.numericMap.set(3, 'fourth');

    // To obtain the selection of planets to populate the dropdowns
    this.spaceService.getPlanets().subscribe((planets: Array<Planet>) => {
      planets.forEach((planet: Planet) => {
        this.planetsArray.push(new Planet(planet.name, planet.distance));
      });
    });

    // To obtain the selection of vehicles to populate the radio buttons
    this.spaceService.getVehicles().subscribe((vehicles: Array<Vehicle>) => {
      vehicles.forEach((vehicle: Vehicle, index) => {
        this.vehiclesArray.push(
          new Vehicle(
            vehicle.name,
            vehicle.total_no,
            vehicle.max_distance,
            vehicle.speed,
            index
          )
        );
      });
    });

    // To obtain the token necessary to submit the falcone destinations
    this.spaceService.getPostToken().subscribe((response: ResponseToken) => {
      this.postToken = response.token;
    });
  }

  // To Display the vehicle selection
  displayVehicleSelectionOrNot(
    selectedFormGroup: string,
    selectedSelect: string
  ): number {
    // To check whether there is a selection of the planet dropdown done
    return this.spaceVehicleForm.get(selectedFormGroup)?.get(selectedSelect)
      ?.value?.length;
  }


  // To decide whether to disable a planet or not
  disablePlanetOrNot(
    optionIndex: number,
    planet: Planet,
    planetSelect: string,
    planetSelectGroup: string
  ) {
    // Checking whether the current planet option has been already selected
    const isPlanetSelected = planet.selected;

    // Getting the current selection of the dropdown
    const currentPlanetSelection = this.spaceVehicleForm
      .get(planetSelectGroup)
      ?.get(planetSelect)?.value;

    /* Checking whether the index of the current option matches the
    current selection and whether the specific planet option's object was selected */
    return optionIndex !== parseInt(currentPlanetSelection, 10) && isPlanetSelected
      ? ''
      : null;
  }

  // To decide whether to disable the vehicle or not
  disableVehicleOrNot(
    selectedFormGroup: string,
    selectedRadio: string,
    selectedPlanetSelect: string,
    vehicle: Vehicle
  ) {
    const selectedVal = this.spaceVehicleForm
      .get(selectedFormGroup)
      ?.get(selectedRadio)?.value;
    const vehicleVal = vehicle.index;
    const whetherSelected = selectedVal === `${vehicleVal}`;
    const vehicleTotalNo = vehicle.total_no;
    const selectedPlanetVal = this.spaceVehicleForm
      .get(selectedFormGroup)
      ?.get(selectedPlanetSelect)?.value;
    const selectedPlanetDistance =
      this.planetsArray[parseInt(selectedPlanetVal, 10)]?.distance;
    /* Checking the criteria of whether the vehicle radio button has to be disabled or not */
    return (!whetherSelected && vehicleTotalNo === 0) ||
      selectedPlanetDistance > vehicle.max_distance
      ? ''
      : null;
  }

  // Getting the specific vehicles selected
  gettingVehicleValues(): Map<any, any> {
    const vehicleSelectionMap = new Map();
    for (let i = 0; i < 4; i++) {
      const vehicleSelected = this.numericMap.get(i);
      const selectionVal = this.spaceVehicleForm
        .get(`${vehicleSelected}SpaceSelection`)
        ?.get(`${vehicleSelected}VehicleSelect`)?.value;
      vehicleSelectionMap.set(
        i,
        selectionVal !== '' && selectionVal !== null
          ? parseInt(selectionVal, 10)
          : -1
      );
    }
    return vehicleSelectionMap;
  }

  // Getting the specific planets selected
  gettingPlanetValues(): Map<any, any> {
    const planetSelectMap = new Map();
    for (let i = 0; i < 4; i++) {
      const planetSelected = this.numericMap.get(i);
      const selectionVal = this.spaceVehicleForm
        .get(`${planetSelected}SpaceSelection`)
        ?.get(`${planetSelected}PlanetSelect`)?.value;
      planetSelectMap.set(
        i,
        selectionVal !== '' && selectionVal !== null
          ? parseInt(selectionVal, 10)
          : -1
      );
    }
    return planetSelectMap;
  }

  // To calculate the total time taken by the vehicles to reach the destination planets
  calculateTotalTimeTaken(vehicleSelectionMap: Map<any, any>): void {
    // resetting the total time taken
    this.totalTimeTaken = 0;
    // getting total time time for travel
    const planetSelectMap = this.gettingPlanetValues();
    for (let i = 0; i < 4; i++) {
      const planetMapVal = planetSelectMap.get(i);
      const vehicleMapVal = vehicleSelectionMap.get(i);

      // Obtaining Distance to the specific selected planet
      const selectedPlanetDistance =
        planetMapVal !== -1 ? this.planetsArray[planetMapVal]?.distance : 0;

      // Obtaining Speed of the specific selected vehicle
      const selectedVehicleSpeed =
        vehicleMapVal !== -1 ? this.vehiclesArray[vehicleMapVal]?.speed : 0;
      const timeTaken =
        selectedPlanetDistance === 0 || selectedVehicleSpeed === 0
          ? 0
          : selectedPlanetDistance / selectedVehicleSpeed;
      // Incrementing the total time taken for the space vehicles to reach their destinations
      this.totalTimeTaken = this.totalTimeTaken + timeTaken;
    }
  }

  // Function called on change of the vehicle radio buttons
  vehicleChange(): void {
    // resetting totals to original values
    this.vehiclesArray.forEach((selectedVehicle) => {
      selectedVehicle.total_no = selectedVehicle.originalTotalNo;
    });
    // adjusting number of total vehicles
    const vehicleSelectionMap = this.gettingVehicleValues();
    for (const [key, val] of vehicleSelectionMap.entries()) {
      if (val !== -1) {
        this.vehiclesArray[val].totalNo =
          this.vehiclesArray[val].getTotalNo - 1;
      }
    }

    this.calculateTotalTimeTaken(vehicleSelectionMap);
  }

  // Function called on change of the planet dropdowns
  planetChange(
    selectedFormGroup: string,
    selectedVehicleSection: string,
  ): void {
    // resetting planet selected flags on planets
    this.planetsArray.forEach((planet) => {
      planet.selected = false;
    });

    // setting the flag for the specific planets selected from the dropdowns
    const planetSelectionMap = this.gettingPlanetValues();
    for (const [key, val] of planetSelectionMap.entries()) {
      if (val !== -1) {
        this.planetsArray[val].selected = true;
      }
    }
    this.spaceVehicleForm
      .get(selectedFormGroup)
      ?.get(selectedVehicleSection)
      ?.reset();
  }

  // Submitting Planet and Vehicle decisions to find Falcone
  submitDestinationDecisions(): void {
    const vehicleMap = this.gettingVehicleValues();
    const planetMap = this.gettingPlanetValues();
    const vehicleRequestArray = [];
    const planetRequestArray = [];

    for (const [key, val] of vehicleMap.entries()) {
      vehicleRequestArray.push(this.vehiclesArray[val].name);
    }
    for (const [key, val] of planetMap.entries()) {
      planetRequestArray.push(this.planetsArray[val].name);
    }

    // Request Body created
    const requestBody = {
      token: this.postToken,
      planet_names: vehicleRequestArray,
      vehicle_names: planetRequestArray,
    };

    // Submitting Falcone request and obtaining response for the same with the redirect happening to the Results page
    this.spaceService
      .postFalconeSubmission(JSON.stringify(requestBody))
      .subscribe((response: FalconeResponse) => {
        const responseStatus = response.status;
        const planetName = response?.planet_name;
        this.router.navigate([
          '/space-result',
          { responseStatus, planetName, timeTaken: this.totalTimeTaken },
        ]);
      });
  }
}
