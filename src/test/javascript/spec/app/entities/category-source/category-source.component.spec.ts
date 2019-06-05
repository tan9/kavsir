/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceComponent } from 'app/entities/category-source/category-source.component';
import { CategorySourceService } from 'app/entities/category-source/category-source.service';
import { CategorySource } from 'app/shared/model/category-source.model';

describe('Component Tests', () => {
  describe('CategorySource Management Component', () => {
    let comp: CategorySourceComponent;
    let fixture: ComponentFixture<CategorySourceComponent>;
    let service: CategorySourceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySourceComponent],
        providers: []
      })
        .overrideTemplate(CategorySourceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategorySourceComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySourceService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CategorySource(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.categorySources[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
