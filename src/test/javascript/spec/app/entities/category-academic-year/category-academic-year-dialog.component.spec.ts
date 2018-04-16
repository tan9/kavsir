/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearDialogComponent } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year-dialog.component';
import { CategoryAcademicYearService } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.service';
import { CategoryAcademicYear } from '../../../../../../main/webapp/app/entities/category-academic-year/category-academic-year.model';

describe('Component Tests', () => {

    describe('CategoryAcademicYear Management Dialog Component', () => {
        let comp: CategoryAcademicYearDialogComponent;
        let fixture: ComponentFixture<CategoryAcademicYearDialogComponent>;
        let service: CategoryAcademicYearService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [KavsirTestModule],
                declarations: [CategoryAcademicYearDialogComponent],
                providers: [
                    CategoryAcademicYearService
                ]
            })
            .overrideTemplate(CategoryAcademicYearDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CategoryAcademicYearDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CategoryAcademicYearService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryAcademicYear(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryAcademicYear = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryAcademicYearListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CategoryAcademicYear();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.categoryAcademicYear = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'categoryAcademicYearListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
