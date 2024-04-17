import { TestBed } from '@angular/core/testing';

import { JsonApiSerializerService } from './json-api-serializer.service';

describe('JsonApiSerializerService', () => {
  let service: JsonApiSerializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonApiSerializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
