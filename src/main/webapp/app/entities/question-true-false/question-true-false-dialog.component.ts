import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalsePopupService } from './question-true-false-popup.service';
import { QuestionTrueFalseService } from './question-true-false.service';
import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper } from '../../shared';
import { CategoryHierarchyService } from '../../shared/category/category-hierarchy.service';

@Component({
    selector: 'jhi-question-true-false-dialog',
    templateUrl: './question-true-false-dialog.component.html'
})
export class QuestionTrueFalseDialogComponent implements OnInit {

    questionTrueFalse: QuestionTrueFalse;
    isSaving: boolean;
    inGroup = true;

    showPreview = false;

    categorynodes: CategoryNode[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private categoryHierarchyService: CategoryHierarchyService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.inGroup = this.route.snapshot.queryParams['group'] !== 'false';

        if (this.categoryHierarchyService.getWorkingCategory() &&
            (!this.questionTrueFalse.categories || this.questionTrueFalse.categories.length === 0)) {
            this.questionTrueFalse.categories = [this.categoryHierarchyService.getWorkingCategory()];
        }

        this.categorynodes = this.categoryHierarchyService.getNodes();
        this.questionGroupService.query()
            .subscribe((res: ResponseWrapper) => { this.questiongroups = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, questionTrueFalse, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                questionTrueFalse[field] = base64Data;
                questionTrueFalse[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionTrueFalse.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionTrueFalseService.update(this.questionTrueFalse));
        } else {
            this.subscribeToSaveResponse(
                this.questionTrueFalseService.create(this.questionTrueFalse));
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionTrueFalse>) {
        result.subscribe((res: QuestionTrueFalse) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionTrueFalse) {
        this.eventManager.broadcast({ name: 'questionTrueFalseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackCategoryNodeById(index: number, item: CategoryNode) {
        return item.id;
    }

    trackResourceImageById(index: number, item: ResourceImage) {
        return item.id;
    }

    trackQuestionGroupById(index: number, item: QuestionGroup) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-question-true-false-popup',
    template: ''
})
export class QuestionTrueFalsePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionTrueFalsePopupService: QuestionTrueFalsePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionTrueFalsePopupService
                    .open(QuestionTrueFalseDialogComponent as Component, params['id']);
            } else {
                this.questionTrueFalsePopupService
                    .open(QuestionTrueFalseDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
