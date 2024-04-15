export namespace Product {
  export interface Entity {
    id: number;
    name: string;
    description: string;
    price: number
    photo?: string;
  }
}
