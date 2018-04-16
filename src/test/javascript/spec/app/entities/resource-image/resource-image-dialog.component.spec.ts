/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { ResourceImageDialogComponent } from '../../../../../../main/webapp/app/entities/resource-image/resource-image-dialog.component';
import { ResourceImageService } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.service';
import { ResourceImage } from '../../../../../../main/webapp/app/entities/resource-image/resource-image.model';
import { QuestionChoiceService } from '../../../../../../main/webapp/app/entities/question-choice';
import { QuestionChoiceOptionService } from '../../../../../../main/webapp/app/entities/question-choice-option';
import { QuestionTrueFalseService } from '../../../../../../main/webapp/app/entities/question-true-false';
import { QuestionEssayService } from '../../../../../../main/webapp/app/entities/question-essay';

describe('Component Tests', () => {

    describe('ResourceImage Management Dialog Component', () => {
        let comp: ResourceImageDialogComponent;
        let fixture: ComponentFixture<ResourceImageDialogComponent>;
        let service: ResourceImageService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [ResourceImageDialogComponent],
                providers: [
                    QuestionChoiceService,
                    QuestionChoiceOptionService,
                    QuestionTrueFalseService,
                    QuestionEssayService,
                    ResourceImageService
                ]
            })
            .overrideTemplate(ResourceImageDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResourceImageDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResourceImageService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ResourceImage(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.resourceImage = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resourceImageListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ResourceImage();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.resourceImage = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resourceImageListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
