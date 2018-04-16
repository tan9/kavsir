/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/question-essay/question-essay-delete-dialog.component';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.service';

describe('Component Tests', () => {

    describe('QuestionEssay Management Delete Component', () => {
        let comp: QuestionEssayDeleteDialogComponent;
        let fixture: ComponentFixture<QuestionEssayDeleteDialogComponent>;
        let service: QuestionEssayService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionEssayDeleteDialogComponent],
                providers: [
                    QuestionEssayService
                ]
            })
            .overrideTemplate(QuestionEssayDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionEssayDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionEssayService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
