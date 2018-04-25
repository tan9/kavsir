/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryNodeDialogComponent } from '../../../../../../main/webapp/app/entities/category-node/category-node-dialog.component';
import { CategoryNodeService } from '../../../../../../main/webapp/app/entities/category-node/category-node.service';
import { CategoryNode } from '../../../../../../main/webapp/app/entities/category-node/category-node.model';
import { QuestionTrueFalseService } from '../../../../../../main/webapp/app/entities/question-true-false';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay';
import { QuestionGroupService } from '../../../../../../main/webapp/app/entities/question-group';

describe('Component Tests', () => {

    describe('CategoryNode Management Dialog Component', () => {
        let comp: CategoryNodeDialogComponent;
        let fixture: ComponentFixture<CategoryNodeDialogComponent>;
        let service: CategoryNodeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryNodeDialogComponent],
                providers: [
                    QuestionTrueFalseService,
                    QuestionChoiceService,
                    QuestionEssayService,
                    QuestionGroupService,
                    CategoryNodeService
                ]
            })
            .overrideTemplate(CategoryNodeDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryNodeDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryNodeService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryNode(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryNode = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryNodeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryNode();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryNode = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryNodeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
