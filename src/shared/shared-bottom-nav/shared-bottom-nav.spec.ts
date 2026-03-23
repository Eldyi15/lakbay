import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBottomNav } from './shared-bottom-nav';

describe('SharedBottomNav', () => {
  let component: SharedBottomNav;
  let fixture: ComponentFixture<SharedBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBottomNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedBottomNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
