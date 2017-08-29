import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

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
        private alertService: JhiAlertService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
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
        }, (response: Response) => {
            this.alertService.error(response.headers.get('X-kavsirApp-error'), null, null);
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-category-semester-delete-popup',
    template: ''
})
export class CategorySemesterDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySemesterPopupService: CategorySemesterPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categorySemesterPopupService
                .open(CategorySemesterDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
