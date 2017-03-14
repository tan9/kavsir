import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradePopupService } from './category-grade-popup.service';
import { CategoryGradeService } from './category-grade.service';
@Component({
    selector: 'jhi-category-grade-dialog',
    templateUrl: './category-grade-dialog.component.html'
})
export class CategoryGradeDialogComponent implements OnInit {

    categoryGrade: CategoryGrade;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private categoryGradeService: CategoryGradeService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['categoryGrade']);
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
        if (this.categoryGrade.id !== undefined) {
            this.categoryGradeService.update(this.categoryGrade)
                .subscribe((res: CategoryGrade) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.categoryGradeService.create(this.categoryGrade)
                .subscribe((res: CategoryGrade) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: CategoryGrade) {
        this.eventManager.broadcast({ name: 'categoryGradeListModification', content: 'OK'});
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
    selector: 'jhi-category-grade-popup',
    template: ''
})
export class CategoryGradePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private categoryGradePopupService: CategoryGradePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent, params['id']);
            } else {
                this.modalRef = this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
