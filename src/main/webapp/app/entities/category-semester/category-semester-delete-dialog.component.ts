import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ICategorySemester } from 'app/shared/model/category-semester.model';
import { CategorySemesterService } from './category-semester.service';

@Component({
  selector: 'jhi-category-semester-delete-dialog',
  templateUrl: './category-semester-delete-dialog.component.html'
})
export class CategorySemesterDeleteDialogComponent {
  categorySemester: ICategorySemester;

  constructor(
    protected categorySemesterService: CategorySemesterService,
    private alertService: JhiAlertService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categorySemesterService.delete(id).subscribe(
      response => {
        this.eventManager.broadcast({
          name: 'categorySemesterListModification',
          content: 'Deleted an categorySemester'
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
  selector: 'jhi-category-semester-delete-popup',
  template: ''
})
export class CategorySemesterDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySemester }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategorySemesterDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categorySemester = categorySemester;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-semester', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-semester', { outlets: { popup: null } }]);
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
