import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
  createDb(): {} | Observable<{}>  {
    return {
      products: [
        {
          id: 1,
          name: 'Laptop1',
          description: '12ª geração Intel® Core™  i5-1235U (10-core, cache de 12MB, até 4.4GHz)',
        },
        {
          id: 2,
          name: 'Tablet',
          description: 'Nosso maior tablet AMOLED Dinâmica 2X ',
        },
        {
          id: 3,
          name: 'Iphone 15 pro',
          description: 'Resolução de 2556 x 1179 pixels a 460 ppp',
        }
      ],
      products1: [
        {
          id: 1,
          name: 'Laptop1',
          description: '12ª geração Intel® Core™  i5-1235U (10-core, cache de 12MB, até 4.4GHz)',
        },
        {
          id: 2,
          name: 'Tablet',
          description: 'Nosso maior tablet AMOLED Dinâmica 2X ',
        },
        {
          id: 4,
          name: 'Iphone 15',
          description: 'Resolução de 2556 x 1179 pixels a 460 ppp',
        }
      ]
    };
  }
}
