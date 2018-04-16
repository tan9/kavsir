import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionPopupService } from './question-choice-option-popup.service';
import { QuestionChoiceOptionService } from './question-choice-option.service';
import { QuestionChoice, QuestionChoiceService } from '../question-choice';
import { ResourceImage, ResourceImageService } from '../resource-image';

@Component({
    selector: 'jhi-question-choice-option-dialog',
    templateUrl: './question-choice-option-dialog.component.html'
})
export class QuestionChoiceOptionDialogComponent implements OnInit {

    questionChoiceOption: QuestionChoiceOption;
    isSaving: boolean;

    questionchoices: QuestionChoice[];

    resourceimages: ResourceImage[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private questionChoiceService: QuestionChoiceService,
        private resourceImageService: ResourceImageService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.questionChoiceService.query()
            .subscribe((res: HttpResponse<QuestionChoice[]>) => { this.questionchoices = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.resourceImageService.query()
            .subscribe((res: HttpResponse<ResourceImage[]>) => { this.resourceimages = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.questionChoiceOption.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionChoiceOptionService.update(this.questionChoiceOption));
        } else {
            this.subscribeToSaveResponse(
                this.questionChoiceOptionService.create(this.questionChoiceOption));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionChoiceOption>>) {
        result.subscribe((res: HttpResponse<QuestionChoiceOption>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionChoiceOption) {
        this.eventManager.broadcast({ name: 'questionChoiceOptionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackQuestionChoiceById(index: number, item: QuestionChoice) {
        return item.id;
    }

    trackResourceImageById(index: number, item: ResourceImage) {
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
    selector: 'jhi-question-choice-option-popup',
    template: ''
})
export class QuestionChoiceOptionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoiceOptionPopupService: QuestionChoiceOptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionChoiceOptionPopupService
                    .open(QuestionChoiceOptionDialogComponent as Component, params['id']);
            } else {
                this.questionChoiceOptionPopupService
                    .open(QuestionChoiceOptionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
