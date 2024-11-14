export class Location {
  id?: string;
  name: string;
  town: string;
  address: string;
  totalWorkedShifts: number;
  totalEarned: number;
  averageRating: number;

  constructor(name: string, town: string, address: string, totalWorkedShifts: number, totalEarned: number, averageRating: number, id = "") {
    if (id != "") {
      this.id = id;
    }
    this.name = name;
    this.town = town;
    this.address = address;
    this.totalWorkedShifts = totalWorkedShifts;
    this.totalEarned = totalEarned;
    this.averageRating = averageRating;
  }

  toString(): string {
    return `\u2606 ${this.averageRating} ${this.town}, ${this.name}`;
  }
}