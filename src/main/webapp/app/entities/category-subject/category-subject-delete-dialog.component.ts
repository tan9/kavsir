import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ICategorySubject } from 'app/shared/model/category-subject.model';
import { CategorySubjectService } from './category-subject.service';

@Component({
  selector: 'jhi-category-subject-delete-dialog',
  templateUrl: './category-subject-delete-dialog.component.html'
})
export class CategorySubjectDeleteDialogComponent {
  categorySubject: ICategorySubject;

  constructor(
    protected categorySubjectService: CategorySubjectService,
    private alertService: JhiAlertService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categorySubjectService.delete(id).subscribe(
      response => {
        this.eventManager.broadcast({
          name: 'categorySubjectListModification',
          content: 'Deleted an categorySubject'
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
  selector: 'jhi-category-subject-delete-popup',
  template: ''
})
export class CategorySubjectDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySubject }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategorySubjectDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categorySubject = categorySubject;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-subject', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-subject', { outlets: { popup: null } }]);
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
