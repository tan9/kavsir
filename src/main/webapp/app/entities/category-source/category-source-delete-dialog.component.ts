import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategorySource } from 'app/shared/model/category-source.model';
import { CategorySourceService } from './category-source.service';

@Component({
  selector: 'jhi-category-source-delete-dialog',
  templateUrl: './category-source-delete-dialog.component.html'
})
export class CategorySourceDeleteDialogComponent {
  categorySource: ICategorySource;

  constructor(
    protected categorySourceService: CategorySourceService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categorySourceService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'categorySourceListModification',
        content: 'Deleted an categorySource'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-category-source-delete-popup',
  template: ''
})
export class CategorySourceDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySource }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategorySourceDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categorySource = categorySource;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-source', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-source', { outlets: { popup: null } }]);
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
