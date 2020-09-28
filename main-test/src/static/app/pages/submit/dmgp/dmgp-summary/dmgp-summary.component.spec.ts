import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgpSummaryComponent } from './dmgp-summary.component';
describe('DmgpSummaryComponent', () => {
  let component: DmgpSummaryComponent;
  let fixture: ComponentFixture<DmgpSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmgpSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmgpSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
