/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterComponent } from 'app/entities/category-semester/category-semester.component';
import { CategorySemesterService } from 'app/entities/category-semester/category-semester.service';
import { CategorySemester } from 'app/shared/model/category-semester.model';

describe('Component Tests', () => {
  describe('CategorySemester Management Component', () => {
    let comp: CategorySemesterComponent;
    let fixture: ComponentFixture<CategorySemesterComponent>;
    let service: CategorySemesterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySemesterComponent],
        providers: []
      })
        .overrideTemplate(CategorySemesterComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategorySemesterComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySemesterService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CategorySemester(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.categorySemesters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
