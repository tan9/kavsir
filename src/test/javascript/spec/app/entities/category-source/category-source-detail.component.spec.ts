/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceComponent } from 'app/entities/category-source/category-source.component';
import { CategorySource } from 'app/shared/model/category-source.model';

describe('Component Tests', () => {
  describe('CategorySource Management Component', () => {
    let comp: CategorySourceComponent;
    let fixture: ComponentFixture<CategorySourceComponent>;
    const route = ({ data: of({ categorySource: new CategorySource(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySourceComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategorySourceComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySourceComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categorySources).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
