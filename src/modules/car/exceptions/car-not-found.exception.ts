export class CarNotFoundException extends Error {
  constructor(id: string) {
    super(`Car with id ${id} not found`);
    this.name = 'CarNotFoundException';
  }
}
