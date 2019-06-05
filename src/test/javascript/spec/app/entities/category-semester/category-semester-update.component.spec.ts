/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterUpdateComponent } from 'app/entities/category-semester/category-semester-update.component';
import { CategorySemesterService } from 'app/entities/category-semester/category-semester.service';
import { CategorySemester } from 'app/shared/model/category-semester.model';

describe('Component Tests', () => {
  describe('CategorySemester Management Update Component', () => {
    let comp: CategorySemesterUpdateComponent;
    let fixture: ComponentFixture<CategorySemesterUpdateComponent>;
    let service: CategorySemesterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySemesterUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategorySemesterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategorySemesterUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySemesterService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategorySemester(123);
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
        const entity = new CategorySemester();
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
