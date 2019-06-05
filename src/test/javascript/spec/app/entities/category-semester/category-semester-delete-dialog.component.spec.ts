/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategorySemesterDeleteDialogComponent } from 'app/entities/category-semester/category-semester-delete-dialog.component';
import { CategorySemesterService } from 'app/entities/category-semester/category-semester.service';

describe('Component Tests', () => {
  describe('CategorySemester Management Delete Component', () => {
    let comp: CategorySemesterDeleteDialogComponent;
    let fixture: ComponentFixture<CategorySemesterDeleteDialogComponent>;
    let service: CategorySemesterService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySemesterDeleteDialogComponent]
      })
        .overrideTemplate(CategorySemesterDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySemesterDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySemesterService);
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
