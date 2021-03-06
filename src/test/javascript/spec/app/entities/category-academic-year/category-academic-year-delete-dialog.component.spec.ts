/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KavsirTestModule } from '../../../test.module';
import { CategoryAcademicYearDeleteDialogComponent } from 'app/entities/category-academic-year/category-academic-year-delete-dialog.component';
import { CategoryAcademicYearService } from 'app/entities/category-academic-year/category-academic-year.service';

describe('Component Tests', () => {
  describe('CategoryAcademicYear Management Delete Component', () => {
    let comp: CategoryAcademicYearDeleteDialogComponent;
    let fixture: ComponentFixture<CategoryAcademicYearDeleteDialogComponent>;
    let service: CategoryAcademicYearService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KavsirTestModule],
        declarations: [CategoryAcademicYearDeleteDialogComponent]
      })
        .overrideTemplate(CategoryAcademicYearDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryAcademicYearDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CategoryAcademicYearService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
