import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorySelectPopupService } from './category-select-popup.service';
import { CategoryHierarchyComponent } from '../../shared/category/category-hierarchy.component';
import { CategoryNode } from '../../entities/category-node/category-node.model';

@Component({
    selector: 'jhi-category-select-dialog',
    templateUrl: './category-select-dialog.component.html'
})
export class CategorySelectDialogComponent implements OnInit {

    authorities: any[];

    @ViewChild(CategoryHierarchyComponent) hierarchy: CategoryHierarchyComponent;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    public getSelected(): CategoryNode[] {
        const nodes = this.hierarchy.tree.treeModel.getActiveNodes();
        if (nodes.length === 1 && nodes[0].isRoot) {
            // return empty nodes if the selected node is ROOT
            return [];
        } else {
            return nodes.map((treeNode) => treeNode.data);
        }
    }

    select() {
        this.eventManager.broadcast({
            name: 'categoriesSelected',
            content: this.getSelected()
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

    constructor(
        private route: ActivatedRoute,
        private categorySelectPopupService: CategorySelectPopupService
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.categorySelectPopupService
                    .open(CategorySelectDialogComponent, params['id']);
            } else {
                this.modalRef = this.categorySelectPopupService
                    .open(CategorySelectDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
