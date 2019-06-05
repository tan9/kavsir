/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceDeleteDialogComponent } from 'app/entities/question-choice/question-choice-delete-dialog.component';
import { QuestionChoiceService } from 'app/entities/question-choice/question-choice.service';

describe('Component Tests', () => {
  describe('QuestionChoice Management Delete Component', () => {
    let comp: QuestionChoiceDeleteDialogComponent;
    let fixture: ComponentFixture<QuestionChoiceDeleteDialogComponent>;
    let service: QuestionChoiceService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionChoiceDeleteDialogComponent]
      })
        .overrideTemplate(QuestionChoiceDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionChoiceDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionChoiceService);
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
