import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ICategoryAcademicYear } from 'app/shared/model/category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
  selector: 'jhi-category-academic-year-delete-dialog',
  templateUrl: './category-academic-year-delete-dialog.component.html'
})
export class CategoryAcademicYearDeleteDialogComponent {
  categoryAcademicYear: ICategoryAcademicYear;

  constructor(
    protected categoryAcademicYearService: CategoryAcademicYearService,
    private alertService: JhiAlertService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoryAcademicYearService.delete(id).subscribe(
      response => {
        this.eventManager.broadcast({
          name: 'categoryAcademicYearListModification',
          content: 'Deleted an categoryAcademicYear'
        });
        this.activeModal.dismiss(true);
      },
      (response: Response) => {
        this.alertService.error(response.headers.get('X-kavsirApp-error'), null, null);
        this.activeModal.dismiss(true);
      }
    );
  }
}

@Component({
  selector: 'jhi-category-academic-year-delete-popup',
  template: ''
})
export class CategoryAcademicYearDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryAcademicYear }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategoryAcademicYearDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.categoryAcademicYear = categoryAcademicYear;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-academic-year', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-academic-year', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
