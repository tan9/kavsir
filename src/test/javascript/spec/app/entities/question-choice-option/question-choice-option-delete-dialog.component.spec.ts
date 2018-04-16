/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceOptionDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option-delete-dialog.component';
import { QuestionChoiceOptionService } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.service';

describe('Component Tests', () => {

    describe('QuestionChoiceOption Management Delete Component', () => {
        let comp: QuestionChoiceOptionDeleteDialogComponent;
        let fixture: ComponentFixture<QuestionChoiceOptionDeleteDialogComponent>;
        let service: QuestionChoiceOptionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceOptionDeleteDialogComponent],
                providers: [
                    QuestionChoiceOptionService
                ]
            })
            .overrideTemplate(QuestionChoiceOptionDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceOptionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
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
