import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderSearchComponent } from './leader-search.component';

describe('LeaderSearchComponent', () => {
  let component: LeaderSearchComponent;
  let fixture: ComponentFixture<LeaderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaderSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
