/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategorySourceDeleteDialogComponent } from 'app/entities/category-source/category-source-delete-dialog.component';
import { CategorySourceService } from 'app/entities/category-source/category-source.service';

describe('Component Tests', () => {
  describe('CategorySource Management Delete Component', () => {
    let comp: CategorySourceDeleteDialogComponent;
    let fixture: ComponentFixture<CategorySourceDeleteDialogComponent>;
    let service: CategorySourceService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySourceDeleteDialogComponent]
      })
        .overrideTemplate(CategorySourceDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySourceDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySourceService);
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
