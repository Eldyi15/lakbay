import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedHeader } from './shared-header';

describe('SharedHeader', () => {
  let component: SharedHeader;
  let fixture: ComponentFixture<SharedHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
