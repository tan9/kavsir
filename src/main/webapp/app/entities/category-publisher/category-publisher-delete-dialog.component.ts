import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherPopupService } from './category-publisher-popup.service';
import { CategoryPublisherService } from './category-publisher.service';

@Component({
    selector: 'jhi-category-publisher-delete-dialog',
    templateUrl: './category-publisher-delete-dialog.component.html'
})
export class CategoryPublisherDeleteDialogComponent {

    categoryPublisher: CategoryPublisher;

    constructor(
        private categoryPublisherService: CategoryPublisherService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categoryPublisherService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categoryPublisherListModification',
                content: 'Deleted an categoryPublisher'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-category-publisher-delete-popup',
    template: ''
})
export class CategoryPublisherDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryPublisherPopupService: CategoryPublisherPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categoryPublisherPopupService
                .open(CategoryPublisherDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
