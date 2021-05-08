export class FalconeResponse {
  planet_name: string;
  status: string;
  error: string;

  constructor(planetName: string, status: string, error: string) {
    this.planet_name = planetName;
    this.status = status;
    this.error = error;
  }
}
