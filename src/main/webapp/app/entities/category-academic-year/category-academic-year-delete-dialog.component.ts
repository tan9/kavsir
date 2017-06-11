import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

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
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
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
        });
    }
}

@Component({
    selector: 'jhi-category-academic-year-delete-popup',
    template: ''
})
export class CategoryAcademicYearDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryAcademicYearPopupService: CategoryAcademicYearPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categoryAcademicYearPopupService
                .open(CategoryAcademicYearDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
