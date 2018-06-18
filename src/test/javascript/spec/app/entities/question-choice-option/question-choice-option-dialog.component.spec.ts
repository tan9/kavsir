/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceOptionDialogComponent } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option-dialog.component';
import { QuestionChoiceOptionService } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.service';
import { QuestionChoiceOption } from '../../../../../../main/webapp/app/entities/question-choice-option/question-choice-option.model';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image';

describe('Component Tests', () => {

    describe('QuestionChoiceOption Management Dialog Component', () => {
        let comp: QuestionChoiceOptionDialogComponent;
        let fixture: ComponentFixture<QuestionChoiceOptionDialogComponent>;
        let service: QuestionChoiceOptionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceOptionDialogComponent],
                providers: [
                    QuestionChoiceService,
                    ResourceImageService,
                    QuestionChoiceOptionService
                ]
            })
            .overrideTemplate(QuestionChoiceOptionDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceOptionDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceOptionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionChoiceOption(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionChoiceOption = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionChoiceOptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionChoiceOption();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionChoiceOption = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionChoiceOptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
