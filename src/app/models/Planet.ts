export class Planet {
  name: string;
  distance: number;
  selected: boolean;
  constructor(name: string, distance: number) {
    this.name = name;
    this.distance = distance;
    this.selected = false;
  }
}
