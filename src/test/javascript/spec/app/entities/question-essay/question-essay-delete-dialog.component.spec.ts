/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayDeleteDialogComponent } from 'app/entities/question-essay/question-essay-delete-dialog.component';
import { QuestionEssayService } from 'app/entities/question-essay/question-essay.service';

describe('Component Tests', () => {
  describe('QuestionEssay Management Delete Component', () => {
    let comp: QuestionEssayDeleteDialogComponent;
    let fixture: ComponentFixture<QuestionEssayDeleteDialogComponent>;
    let service: QuestionEssayService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionEssayDeleteDialogComponent]
      })
        .overrideTemplate(QuestionEssayDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionEssayDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionEssayService);
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
