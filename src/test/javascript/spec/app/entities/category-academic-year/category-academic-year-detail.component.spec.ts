/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearDetailComponent } from 'app/entities/category-academic-year/category-academic-year-detail.component';
import { CategoryAcademicYear } from 'app/shared/model/category-academic-year.model';

describe('Component Tests', () => {
  describe('CategoryAcademicYear Management Detail Component', () => {
    let comp: CategoryAcademicYearDetailComponent;
    let fixture: ComponentFixture<CategoryAcademicYearDetailComponent>;
    const route = ({ data: of({ categoryAcademicYear: new CategoryAcademicYear(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryAcademicYearDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CategoryAcademicYearDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryAcademicYearDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoryAcademicYear).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
