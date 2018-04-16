/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryPublisherDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher-delete-dialog.component';
import { CategoryPublisherService } from '../../../../../../main/webapp/app/entities/category-publisher/category-publisher.service';

describe('Component Tests', () => {

    describe('CategoryPublisher Management Delete Component', () => {
        let comp: CategoryPublisherDeleteDialogComponent;
        let fixture: ComponentFixture<CategoryPublisherDeleteDialogComponent>;
        let service: CategoryPublisherService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryPublisherDeleteDialogComponent],
                providers: [
                    CategoryPublisherService
                ]
            })
            .overrideTemplate(CategoryPublisherDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryPublisherDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryPublisherService);
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
