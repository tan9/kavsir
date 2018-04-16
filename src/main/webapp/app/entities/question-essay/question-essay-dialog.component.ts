import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayPopupService } from './question-essay-popup.service';
import { QuestionEssayService } from './question-essay.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';

@Component({
    selector: 'jhi-question-essay-dialog',
    templateUrl: './question-essay-dialog.component.html'
})
export class QuestionEssayDialogComponent implements OnInit {

    questionEssay: QuestionEssay;
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private questionEssayService: QuestionEssayService,
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
        if (this.questionEssay.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionEssayService.update(this.questionEssay));
        } else {
            this.subscribeToSaveResponse(
                this.questionEssayService.create(this.questionEssay));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionEssay>>) {
        result.subscribe((res: HttpResponse<QuestionEssay>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionEssay) {
        this.eventManager.broadcast({ name: 'questionEssayListModification', content: 'OK'});
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
    selector: 'jhi-question-essay-popup',
    template: ''
})
export class QuestionEssayPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionEssayPopupService: QuestionEssayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionEssayPopupService
                    .open(QuestionEssayDialogComponent as Component, params['id']);
            } else {
                this.questionEssayPopupService
                    .open(QuestionEssayDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
