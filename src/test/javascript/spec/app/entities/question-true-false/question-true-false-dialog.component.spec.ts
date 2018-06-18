/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionTrueFalseDialogComponent } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false-dialog.component';
import { QuestionTrueFalseService } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.service';
import { QuestionTrueFalse } from '../../../../../../main/webapp/app/entities/question-true-false/question-true-false.model';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group';

describe('Component Tests', () => {

    describe('QuestionTrueFalse Management Dialog Component', () => {
        let comp: QuestionTrueFalseDialogComponent;
        let fixture: ComponentFixture<QuestionTrueFalseDialogComponent>;
        let service: QuestionTrueFalseService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionTrueFalseDialogComponent],
                providers: [
                    CategoryNodeService,
                    ResourceImageService,
                    QuestionGroupService,
                    QuestionTrueFalseService
                ]
            })
            .overrideTemplate(QuestionTrueFalseDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionTrueFalseDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionTrueFalseService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionTrueFalse(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionTrueFalse = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionTrueFalseListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionTrueFalse();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionTrueFalse = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionTrueFalseListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
