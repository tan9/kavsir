/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeUpdateComponent } from 'app/entities/category-grade/category-grade-update.component';
import { CategoryGradeService } from 'app/entities/category-grade/category-grade.service';
import { CategoryGrade } from 'app/shared/model/category-grade.model';

describe('Component Tests', () => {
  describe('CategoryGrade Management Update Component', () => {
    let comp: CategoryGradeUpdateComponent;
    let fixture: ComponentFixture<CategoryGradeUpdateComponent>;
    let service: CategoryGradeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryGradeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategoryGradeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryGradeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryGradeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategoryGrade(123);
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
        const entity = new CategoryGrade();
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
