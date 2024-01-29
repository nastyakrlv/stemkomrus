import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogOrItemComponent } from './catalog-or-item.component';

describe('CatalogOrItemComponent', () => {
  let component: CatalogOrItemComponent;
  let fixture: ComponentFixture<CatalogOrItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogOrItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogOrItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
