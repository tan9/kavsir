/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySubjectUpdateComponent } from 'app/entities/category-subject/category-subject-update.component';
import { CategorySubjectService } from 'app/entities/category-subject/category-subject.service';
import { CategorySubject } from 'app/shared/model/category-subject.model';

describe('Component Tests', () => {
  describe('CategorySubject Management Update Component', () => {
    let comp: CategorySubjectUpdateComponent;
    let fixture: ComponentFixture<CategorySubjectUpdateComponent>;
    let service: CategorySubjectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySubjectUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategorySubjectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategorySubjectUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySubjectService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategorySubject(123);
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
        const entity = new CategorySubject();
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
