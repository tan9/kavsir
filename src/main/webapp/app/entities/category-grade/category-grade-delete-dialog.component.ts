import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ICategoryGrade } from 'app/shared/model/category-grade.model';
import { CategoryGradeService } from './category-grade.service';

@Component({
  selector: 'jhi-category-grade-delete-dialog',
  templateUrl: './category-grade-delete-dialog.component.html'
})
export class CategoryGradeDeleteDialogComponent {
  categoryGrade: ICategoryGrade;

  constructor(
    protected categoryGradeService: CategoryGradeService,
    private alertService: JhiAlertService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoryGradeService.delete(id).subscribe(
      response => {
        this.eventManager.broadcast({
          name: 'categoryGradeListModification',
          content: 'Deleted an categoryGrade'
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
  selector: 'jhi-category-grade-delete-popup',
  template: ''
})
export class CategoryGradeDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryGrade }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategoryGradeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categoryGrade = categoryGrade;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-grade', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-grade', { outlets: { popup: null } }]);
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
