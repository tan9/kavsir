import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorySelectPopupService } from './category-select-popup.service';
import { CategoryHierarchyComponent } from '../../shared/category/category-hierarchy.component';
import { CategoryNode } from 'app/shared/model/category-node.model';

@Component({
  selector: 'jhi-category-select-dialog',
  templateUrl: './category-select-dialog.component.html'
})
export class CategorySelectDialogComponent implements OnInit {
  authorities: any[];

  @ViewChild(CategoryHierarchyComponent) hierarchy: CategoryHierarchyComponent;

  constructor(public activeModal: NgbActiveModal, private alertService: JhiAlertService, private eventManager: JhiEventManager) {}

  ngOnInit() {
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  public getSelected(): CategoryNode[] {
    return this.hierarchy.getSelected();
  }

  select() {
    const selected = this.getSelected()[0];
    this.hierarchy.select(selected);

    this.eventManager.broadcast({
      name: 'categorySelected',
      content: selected
    });
    this.activeModal.dismiss(true);
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-category-select-popup',
  template: ''
})
export class CategorySelectPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(private route: ActivatedRoute, private categorySelectPopupService: CategorySelectPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.categorySelectPopupService.open(CategorySelectDialogComponent as Component, params['id']);
      } else {
        this.modalRef = this.categorySelectPopupService.open(CategorySelectDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
