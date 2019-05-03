/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategorySubjectDeleteDialogComponent } from 'app/entities/category-subject/category-subject-delete-dialog.component';
import { CategorySubjectService } from 'app/entities/category-subject/category-subject.service';

describe('Component Tests', () => {
  describe('CategorySubject Management Delete Component', () => {
    let comp: CategorySubjectDeleteDialogComponent;
    let fixture: ComponentFixture<CategorySubjectDeleteDialogComponent>;
    let service: CategorySubjectService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategorySubjectDeleteDialogComponent]
      })
        .overrideTemplate(CategorySubjectDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategorySubjectDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategorySubjectService);
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
