import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearPopupService } from './category-academic-year-popup.service';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
    selector: 'jhi-category-academic-year-delete-dialog',
    templateUrl: './category-academic-year-delete-dialog.component.html'
})
export class CategoryAcademicYearDeleteDialogComponent {

    categoryAcademicYear: CategoryAcademicYear;

    constructor(
        private categoryAcademicYearService: CategoryAcademicYearService,
        private alertService: JhiAlertService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categoryAcademicYearService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categoryAcademicYearListModification',
                content: 'Deleted an categoryAcademicYear'
            });
            this.activeModal.dismiss(true);
        }, (response: Response) => {
            this.alertService.error(response.headers.get('X-kavsirApp-error'), null, null);
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-category-academic-year-delete-popup',
    template: ''
})
export class CategoryAcademicYearDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryAcademicYearPopupService: CategoryAcademicYearPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categoryAcademicYearPopupService
                .open(CategoryAcademicYearDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
