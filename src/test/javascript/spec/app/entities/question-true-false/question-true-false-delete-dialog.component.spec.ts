/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionTrueFalseDeleteDialogComponent } from 'app/entities/question-true-false/question-true-false-delete-dialog.component';
import { QuestionTrueFalseService } from 'app/entities/question-true-false/question-true-false.service';

describe('Component Tests', () => {
  describe('QuestionTrueFalse Management Delete Component', () => {
    let comp: QuestionTrueFalseDeleteDialogComponent;
    let fixture: ComponentFixture<QuestionTrueFalseDeleteDialogComponent>;
    let service: QuestionTrueFalseService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionTrueFalseDeleteDialogComponent]
      })
        .overrideTemplate(QuestionTrueFalseDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionTrueFalseDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionTrueFalseService);
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
