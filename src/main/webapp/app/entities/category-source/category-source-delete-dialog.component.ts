import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySource } from './category-source.model';
import { CategorySourcePopupService } from './category-source-popup.service';
import { CategorySourceService } from './category-source.service';

@Component({
    selector: 'jhi-category-source-delete-dialog',
    templateUrl: './category-source-delete-dialog.component.html'
})
export class CategorySourceDeleteDialogComponent {

    categorySource: CategorySource;

    constructor(
        private categorySourceService: CategorySourceService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categorySourceService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySourcePopupService: CategorySourcePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categorySourcePopupService
                .open(CategorySourceDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
