import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterPopupService } from './category-semester-popup.service';
import { CategorySemesterService } from './category-semester.service';

@Component({
    selector: 'jhi-category-semester-dialog',
    templateUrl: './category-semester-dialog.component.html'
})
export class CategorySemesterDialogComponent implements OnInit {

    categorySemester: CategorySemester;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private categorySemesterService: CategorySemesterService,
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
        if (this.categorySemester.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorySemesterService.update(this.categorySemester));
        } else {
            this.subscribeToSaveResponse(
                this.categorySemesterService.create(this.categorySemester));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CategorySemester>>) {
        result.subscribe((res: HttpResponse<CategorySemester>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CategorySemester) {
        this.eventManager.broadcast({ name: 'categorySemesterListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-category-semester-popup',
    template: ''
})
export class CategorySemesterPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySemesterPopupService: CategorySemesterPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent as Component, params['id']);
            } else {
                this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
