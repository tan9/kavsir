/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeComponent } from 'app/entities/category-grade/category-grade.component';
import { CategoryGradeService } from 'app/entities/category-grade/category-grade.service';
import { CategoryGrade } from 'app/shared/model/category-grade.model';

describe('Component Tests', () => {
  describe('CategoryGrade Management Component', () => {
    let comp: CategoryGradeComponent;
    let fixture: ComponentFixture<CategoryGradeComponent>;
    let service: CategoryGradeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryGradeComponent],
        providers: []
      })
        .overrideTemplate(CategoryGradeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryGradeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryGradeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CategoryGrade(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.categoryGrades[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
