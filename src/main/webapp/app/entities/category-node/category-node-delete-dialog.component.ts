import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategoryNode } from 'app/shared/model/category-node.model';
import { CategoryNodeService } from './category-node.service';

@Component({
  selector: 'jhi-category-node-delete-dialog',
  templateUrl: './category-node-delete-dialog.component.html'
})
export class CategoryNodeDeleteDialogComponent {
  categoryNode: ICategoryNode;

  constructor(
    protected categoryNodeService: CategoryNodeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoryNodeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'categoryNodeListModification',
        content: 'Deleted an categoryNode'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-category-node-delete-popup',
  template: ''
})
export class CategoryNodeDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryNode }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategoryNodeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categoryNode = categoryNode;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/category-node', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/category-node', { outlets: { popup: null } }]);
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
