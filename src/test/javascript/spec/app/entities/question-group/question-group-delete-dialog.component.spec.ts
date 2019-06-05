/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionGroupDeleteDialogComponent } from 'app/entities/question-group/question-group-delete-dialog.component';
import { QuestionGroupService } from 'app/entities/question-group/question-group.service';

describe('Component Tests', () => {
  describe('QuestionGroup Management Delete Component', () => {
    let comp: QuestionGroupDeleteDialogComponent;
    let fixture: ComponentFixture<QuestionGroupDeleteDialogComponent>;
    let service: QuestionGroupService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [QuestionGroupDeleteDialogComponent]
      })
        .overrideTemplate(QuestionGroupDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionGroupDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuestionGroupService);
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
