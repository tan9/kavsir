/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryPublisherDialogComponent } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher-dialog.component';
import { CategoryPublisherService } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.service';
import { CategoryPublisher } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.model';

describe('Component Tests', () => {

    describe('CategoryPublisher Management Dialog Component', () => {
        let comp: CategoryPublisherDialogComponent;
        let fixture: ComponentFixture<CategoryPublisherDialogComponent>;
        let service: CategoryPublisherService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryPublisherDialogComponent],
                providers: [
                    CategoryPublisherService
                ]
            })
            .overrideTemplate(CategoryPublisherDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryPublisherDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryPublisherService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryPublisher(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryPublisher = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryPublisherListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryPublisher();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryPublisher = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryPublisherListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
