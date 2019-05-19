import { TestBed } from '@angular/core/testing';

import { TodoHttpService } from './todo-http.service';

describe('TodoHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoHttpService = TestBed.get(TodoHttpService);
    expect(service).toBeTruthy();
  });
});
