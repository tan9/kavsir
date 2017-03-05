import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearPopupService } from './category-academic-year-popup.service';
import { CategoryAcademicYearService } from './category-academic-year.service';
@Component({
    selector: 'jhi-category-academic-year-dialog',
    templateUrl: './category-academic-year-dialog.component.html'
})
export class CategoryAcademicYearDialogComponent implements OnInit {

    categoryAcademicYear: CategoryAcademicYear;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private categoryAcademicYearService: CategoryAcademicYearService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['categoryAcademicYear']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.categoryAcademicYear.id !== undefined) {
            this.categoryAcademicYearService.update(this.categoryAcademicYear)
                .subscribe((res: CategoryAcademicYear) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.categoryAcademicYearService.create(this.categoryAcademicYear)
                .subscribe((res: CategoryAcademicYear) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: CategoryAcademicYear) {
        this.eventManager.broadcast({ name: 'categoryAcademicYearListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-category-academic-year-popup',
    template: ''
})
export class CategoryAcademicYearPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private categoryAcademicYearPopupService: CategoryAcademicYearPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.categoryAcademicYearPopupService
                    .open(CategoryAcademicYearDialogComponent, params['id']);
            } else {
                this.modalRef = this.categoryAcademicYearPopupService
                    .open(CategoryAcademicYearDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
