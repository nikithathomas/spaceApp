export class Vehicle {
  name: string;
  total_no: number;
  max_distance: number;
  speed: number;
  index: number;
  originalTotalNo: number;

  constructor(
    name: string,
    total_no: number,
    max_distance: number,
    speed: number,
    index: number
  ) {
    this.name = name;
    this.total_no = total_no;
    this.max_distance = max_distance;
    this.speed = speed;
    this.index = index;
    this.originalTotalNo = this.total_no;
  }
  set totalNo(totalNo: number){
    this.total_no = totalNo;
  }
  get getTotalNo(): number {
    return this.total_no;
  }
}
