import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterPopupService } from './category-semester-popup.service';
import { CategorySemesterService } from './category-semester.service';
@Component({
    selector: 'jhi-category-semester-dialog',
    templateUrl: './category-semester-dialog.component.html'
})
export class CategorySemesterDialogComponent implements OnInit {

    categorySemester: CategorySemester;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private categorySemesterService: CategorySemesterService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['categorySemester']);
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
        if (this.categorySemester.id !== undefined) {
            this.categorySemesterService.update(this.categorySemester)
                .subscribe((res: CategorySemester) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.categorySemesterService.create(this.categorySemester)
                .subscribe((res: CategorySemester) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: CategorySemester) {
        this.eventManager.broadcast({ name: 'categorySemesterListModification', content: 'OK'});
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
    selector: 'jhi-category-semester-popup',
    template: ''
})
export class CategorySemesterPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private categorySemesterPopupService: CategorySemesterPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent, params['id']);
            } else {
                this.modalRef = this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
