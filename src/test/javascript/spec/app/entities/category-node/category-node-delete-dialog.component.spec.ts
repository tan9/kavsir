/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryNodeDeleteDialogComponent } from 'app/entities/category-node/category-node-delete-dialog.component';
import { CategoryNodeService } from 'app/entities/category-node/category-node.service';

describe('Component Tests', () => {
  describe('CategoryNode Management Delete Component', () => {
    let comp: CategoryNodeDeleteDialogComponent;
    let fixture: ComponentFixture<CategoryNodeDeleteDialogComponent>;
    let service: CategoryNodeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryNodeDeleteDialogComponent]
      })
        .overrideTemplate(CategoryNodeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryNodeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryNodeService);
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
