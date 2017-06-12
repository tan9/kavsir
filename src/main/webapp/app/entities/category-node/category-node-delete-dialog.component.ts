import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { CategoryNode } from './category-node.model';
import { CategoryNodePopupService } from './category-node-popup.service';
import { CategoryNodeService } from './category-node.service';

@Component({
    selector: 'jhi-category-node-delete-dialog',
    templateUrl: './category-node-delete-dialog.component.html'
})
export class CategoryNodeDeleteDialogComponent {

    categoryNode: CategoryNode;

    constructor(
        private categoryNodeService: CategoryNodeService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categoryNodeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categoryNodeListModification',
                content: 'Deleted an categoryNode'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.categoryNode.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-category-node-delete-popup',
    template: ''
})
export class CategoryNodeDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryNodePopupService: CategoryNodePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categoryNodePopupService
                .open(CategoryNodeDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
