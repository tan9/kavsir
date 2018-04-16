import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalsePopupService } from './question-true-false-popup.service';
import { QuestionTrueFalseService } from './question-true-false.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';

@Component({
    selector: 'jhi-question-true-false-dialog',
    templateUrl: './question-true-false-dialog.component.html'
})
export class QuestionTrueFalseDialogComponent implements OnInit {

    questionTrueFalse: QuestionTrueFalse;
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryNodeService.query()
            .subscribe((res: HttpResponse<CategoryNode[]>) => { this.categorynodes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.resourceImageService.query()
            .subscribe((res: HttpResponse<ResourceImage[]>) => { this.resourceimages = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionGroupService.query()
            .subscribe((res: HttpResponse<QuestionGroup[]>) => { this.questiongroups = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionTrueFalse>>) {
        result.subscribe((res: HttpResponse<QuestionTrueFalse>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionTrueFalse) {
        this.eventManager.broadcast({ name: 'questionTrueFalseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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
