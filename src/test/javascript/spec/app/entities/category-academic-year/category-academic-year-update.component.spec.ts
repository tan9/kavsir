/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearUpdateComponent } from 'app/entities/category-academic-year/category-academic-year-update.component';
import { CategoryAcademicYearService } from 'app/entities/category-academic-year/category-academic-year.service';
import { CategoryAcademicYear } from 'app/shared/model/category-academic-year.model';

describe('Component Tests', () => {
  describe('CategoryAcademicYear Management Update Component', () => {
    let comp: CategoryAcademicYearUpdateComponent;
    let fixture: ComponentFixture<CategoryAcademicYearUpdateComponent>;
    let service: CategoryAcademicYearService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryAcademicYearUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategoryAcademicYearUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryAcademicYearUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryAcademicYearService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategoryAcademicYear(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategoryAcademicYear();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
