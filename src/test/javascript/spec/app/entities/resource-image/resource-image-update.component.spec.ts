/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KavsirTestModule } from '../../../test.module';
import { ResourceImageUpdateComponent } from 'app/entities/resource-image/resource-image-update.component';
import { ResourceImageService } from 'app/entities/resource-image/resource-image.service';
import { ResourceImage } from 'app/shared/model/resource-image.model';

describe('Component Tests', () => {
  describe('ResourceImage Management Update Component', () => {
    let comp: ResourceImageUpdateComponent;
    let fixture: ComponentFixture<ResourceImageUpdateComponent>;
    let service: ResourceImageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [ResourceImageUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ResourceImageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResourceImageUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResourceImageService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResourceImage(123);
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
        const entity = new ResourceImage();
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
