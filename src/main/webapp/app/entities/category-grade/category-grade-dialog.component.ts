import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradePopupService } from './category-grade-popup.service';
import { CategoryGradeService } from './category-grade.service';

@Component({
    selector: 'jhi-category-grade-dialog',
    templateUrl: './category-grade-dialog.component.html'
})
export class CategoryGradeDialogComponent implements OnInit {

    categoryGrade: CategoryGrade;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private categoryGradeService: CategoryGradeService,
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
        if (this.categoryGrade.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryGradeService.update(this.categoryGrade));
        } else {
            this.subscribeToSaveResponse(
                this.categoryGradeService.create(this.categoryGrade));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CategoryGrade>>) {
        result.subscribe((res: HttpResponse<CategoryGrade>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryGrade) {
        this.eventManager.broadcast({ name: 'categoryGradeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-category-grade-popup',
    template: ''
})
export class CategoryGradePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryGradePopupService: CategoryGradePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent as Component, params['id']);
            } else {
                this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
