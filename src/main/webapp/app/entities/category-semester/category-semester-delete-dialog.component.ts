import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterPopupService } from './category-semester-popup.service';
import { CategorySemesterService } from './category-semester.service';

@Component({
    selector: 'jhi-category-semester-delete-dialog',
    templateUrl: './category-semester-delete-dialog.component.html'
})
export class CategorySemesterDeleteDialogComponent {

    categorySemester: CategorySemester;

    constructor(
        private categorySemesterService: CategorySemesterService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categorySemesterService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categorySemesterListModification',
                content: 'Deleted an categorySemester'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.categorySemester.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-category-semester-delete-popup',
    template: ''
})
export class CategorySemesterDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySemesterPopupService: CategorySemesterPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categorySemesterPopupService
                .open(CategorySemesterDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
