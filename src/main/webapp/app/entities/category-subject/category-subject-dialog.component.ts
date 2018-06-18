import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySubject } from './category-subject.model';
import { CategorySubjectPopupService } from './category-subject-popup.service';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-dialog',
    templateUrl: './category-subject-dialog.component.html'
})
export class CategorySubjectDialogComponent implements OnInit {

    categorySubject: CategorySubject;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private categorySubjectService: CategorySubjectService,
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
        if (this.categorySubject.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorySubjectService.update(this.categorySubject));
        } else {
            this.subscribeToSaveResponse(
                this.categorySubjectService.create(this.categorySubject));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CategorySubject>>) {
        result.subscribe((res: HttpResponse<CategorySubject>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CategorySubject) {
        this.eventManager.broadcast({ name: 'categorySubjectListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-category-subject-popup',
    template: ''
})
export class CategorySubjectPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySubjectPopupService: CategorySubjectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent as Component, params['id']);
            } else {
                this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
