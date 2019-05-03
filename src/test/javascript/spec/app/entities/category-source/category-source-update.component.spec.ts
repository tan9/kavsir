/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceUpdateComponent } from 'app/entities/category-source/category-source-update.component';
import { CategorySourceService } from 'app/entities/category-source/category-source.service';
import { CategorySource } from 'app/shared/model/category-source.model';

describe('Component Tests', () => {
  describe('CategorySource Management Update Component', () => {
    let comp: CategorySourceUpdateComponent;
    let fixture: ComponentFixture<CategorySourceUpdateComponent>;
    let service: CategorySourceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySourceUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategorySourceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategorySourceUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySourceService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategorySource(123);
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
        const entity = new CategorySource();
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
