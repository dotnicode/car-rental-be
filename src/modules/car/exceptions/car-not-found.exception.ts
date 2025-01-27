export class CarNotFoundException extends Error {
  constructor(id: number) {
    super(`Car with id ${id} not found`);
    this.name = 'CarNotFoundException';
  }
}
