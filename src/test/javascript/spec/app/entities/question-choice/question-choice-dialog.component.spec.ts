/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionChoiceDialogComponent } from '../../../../../../main/webapp/app/entities/question-choice/question-choice-dialog.component';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.service';
import { QuestionChoice } from '../../../../../../main/webapp/app/entities/question-choice/question-choice.model';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group';

describe('Component Tests', () => {

    describe('QuestionChoice Management Dialog Component', () => {
        let comp: QuestionChoiceDialogComponent;
        let fixture: ComponentFixture<QuestionChoiceDialogComponent>;
        let service: QuestionChoiceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionChoiceDialogComponent],
                providers: [
                    CategoryNodeService,
                    ResourceImageService,
                    QuestionGroupService,
                    QuestionChoiceService
                ]
            })
            .overrideTemplate(QuestionChoiceDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionChoiceDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionChoiceService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionChoice(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionChoice = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionChoiceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionChoice();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionChoice = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionChoiceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
