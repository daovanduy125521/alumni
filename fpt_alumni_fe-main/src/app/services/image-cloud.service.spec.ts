import { TestBed } from '@angular/core/testing';

import { ImageCloudService } from './image-cloud.service';

describe('ImageCloudService', () => {
  let service: ImageCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
