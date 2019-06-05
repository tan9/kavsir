/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { ResourceImageDeleteDialogComponent } from 'app/entities/resource-image/resource-image-delete-dialog.component';
import { ResourceImageService } from 'app/entities/resource-image/resource-image.service';

describe('Component Tests', () => {
  describe('ResourceImage Management Delete Component', () => {
    let comp: ResourceImageDeleteDialogComponent;
    let fixture: ComponentFixture<ResourceImageDeleteDialogComponent>;
    let service: ResourceImageService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [ResourceImageDeleteDialogComponent]
      })
        .overrideTemplate(ResourceImageDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResourceImageDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResourceImageService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
