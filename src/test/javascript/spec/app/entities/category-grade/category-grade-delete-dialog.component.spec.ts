/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryGradeDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/category-grade/category-grade-delete-dialog.component';
import { CategoryGradeService } from '../../../../../../main/webapp/app/entities/category-grade/category-grade.service';

describe('Component Tests', () => {

    describe('CategoryGrade Management Delete Component', () => {
        let comp: CategoryGradeDeleteDialogComponent;
        let fixture: ComponentFixture<CategoryGradeDeleteDialogComponent>;
        let service: CategoryGradeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryGradeDeleteDialogComponent],
                providers: [
                    CategoryGradeService
                ]
            })
            .overrideTemplate(CategoryGradeDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryGradeDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryGradeService);
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
