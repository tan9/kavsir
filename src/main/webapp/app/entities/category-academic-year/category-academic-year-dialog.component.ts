import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearPopupService } from './category-academic-year-popup.service';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
    selector: 'jhi-category-academic-year-dialog',
    templateUrl: './category-academic-year-dialog.component.html'
})
export class CategoryAcademicYearDialogComponent implements OnInit {

    categoryAcademicYear: CategoryAcademicYear;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private categoryAcademicYearService: CategoryAcademicYearService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.categoryAcademicYear.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryAcademicYearService.update(this.categoryAcademicYear));
        } else {
            this.subscribeToSaveResponse(
                this.categoryAcademicYearService.create(this.categoryAcademicYear));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryAcademicYear>) {
        result.subscribe((res: CategoryAcademicYear) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryAcademicYear) {
        this.eventManager.broadcast({ name: 'categoryAcademicYearListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-category-academic-year-popup',
    template: ''
})
export class CategoryAcademicYearPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryAcademicYearPopupService: CategoryAcademicYearPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categoryAcademicYearPopupService
                    .open(CategoryAcademicYearDialogComponent as Component, params['id']);
            } else {
                this.categoryAcademicYearPopupService
                    .open(CategoryAcademicYearDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
