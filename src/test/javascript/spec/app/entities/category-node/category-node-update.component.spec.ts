/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { CategoryNodeUpdateComponent } from 'app/entities/category-node/category-node-update.component';
import { CategoryNodeService } from 'app/entities/category-node/category-node.service';
import { CategoryNode } from 'app/shared/model/category-node.model';

describe('Component Tests', () => {
  describe('CategoryNode Management Update Component', () => {
    let comp: CategoryNodeUpdateComponent;
    let fixture: ComponentFixture<CategoryNodeUpdateComponent>;
    let service: CategoryNodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryNodeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CategoryNodeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryNodeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryNodeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CategoryNode(123);
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
        const entity = new CategoryNode();
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
