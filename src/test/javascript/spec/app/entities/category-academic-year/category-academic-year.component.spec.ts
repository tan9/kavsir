/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearComponent } from 'app/entities/category-academic-year/category-academic-year.component';
import { CategoryAcademicYearService } from 'app/entities/category-academic-year/category-academic-year.service';
import { CategoryAcademicYear } from 'app/shared/model/category-academic-year.model';

describe('Component Tests', () => {
  describe('CategoryAcademicYear Management Component', () => {
    let comp: CategoryAcademicYearComponent;
    let fixture: ComponentFixture<CategoryAcademicYearComponent>;
    let service: CategoryAcademicYearService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryAcademicYearComponent],
        providers: []
      })
        .overrideTemplate(CategoryAcademicYearComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryAcademicYearComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryAcademicYearService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CategoryAcademicYear(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.categoryAcademicYears[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
