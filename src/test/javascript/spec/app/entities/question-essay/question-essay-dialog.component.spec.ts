/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { QuestionEssayDialogComponent } from '../../../../../../main/webapp/app/entities/question-essay/question-essay-dialog.component';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.service';
import { QuestionEssay } from '../../../../../../main/webapp/app/entities/question-essay/question-essay.model';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group';

describe('Component Tests', () => {

    describe('QuestionEssay Management Dialog Component', () => {
        let comp: QuestionEssayDialogComponent;
        let fixture: ComponentFixture<QuestionEssayDialogComponent>;
        let service: QuestionEssayService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [QuestionEssayDialogComponent],
                providers: [
                    CategoryNodeService,
                    ResourceImageService,
                    QuestionGroupService,
                    QuestionEssayService
                ]
            })
            .overrideTemplate(QuestionEssayDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionEssayDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionEssayService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionEssay(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionEssay = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionEssayListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionEssay();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionEssay = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionEssayListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
