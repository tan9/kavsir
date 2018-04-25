import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ResourceImage } from './resource-image.model';
import { ResourceImagePopupService } from './resource-image-popup.service';
import { ResourceImageService } from './resource-image.service';
import { QuestionChoice, QuestionChoiceService } from '../question-choice';
import { QuestionChoiceOption, QuestionChoiceOptionService } from '../question-choice-option';
import { QuestionTrueFalse, QuestionTrueFalseService } from '../question-true-false';
import { QuestionEssay, QuestionEssayService } from '../question-essay';

@Component({
    selector: 'jhi-resource-image-dialog',
    templateUrl: './resource-image-dialog.component.html'
})
export class ResourceImageDialogComponent implements OnInit {

    resourceImage: ResourceImage;
    isSaving: boolean;

    questionchoices: QuestionChoice[];

    questionchoiceoptions: QuestionChoiceOption[];

    questiontruefalses: QuestionTrueFalse[];

    questionessays: QuestionEssay[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private resourceImageService: ResourceImageService,
        private questionChoiceService: QuestionChoiceService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private questionEssayService: QuestionEssayService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.questionChoiceService.query()
            .subscribe((res: HttpResponse<QuestionChoice[]>) => { this.questionchoices = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionChoiceOptionService.query()
            .subscribe((res: HttpResponse<QuestionChoiceOption[]>) => { this.questionchoiceoptions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionTrueFalseService.query()
            .subscribe((res: HttpResponse<QuestionTrueFalse[]>) => { this.questiontruefalses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionEssayService.query()
            .subscribe((res: HttpResponse<QuestionEssay[]>) => { this.questionessays = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, resourceImage, field, isImage) {
        this.dataUtils.setFileData(event, resourceImage, field, isImage);

        if (event && event.target.files && event.target.files[0]) {
            if (!resourceImage.name) {
                const file = event.target.files[0];
                resourceImage.name = file.name;
            }
        }
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.resourceImage, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.resourceImage.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resourceImageService.update(this.resourceImage));
        } else {
            this.subscribeToSaveResponse(
                this.resourceImageService.create(this.resourceImage));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ResourceImage>>) {
        result.subscribe((res: HttpResponse<ResourceImage>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ResourceImage) {
        this.eventManager.broadcast({ name: 'resourceImageListModification', content: 'OK'});
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

    trackQuestionChoiceOptionById(index: number, item: QuestionChoiceOption) {
        return item.id;
    }

    trackQuestionTrueFalseById(index: number, item: QuestionTrueFalse) {
        return item.id;
    }

    trackQuestionEssayById(index: number, item: QuestionEssay) {
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
    selector: 'jhi-resource-image-popup',
    template: ''
})
export class ResourceImagePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourceImagePopupService: ResourceImagePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.resourceImagePopupService
                    .open(ResourceImageDialogComponent as Component, params['id']);
            } else {
                this.resourceImagePopupService
                    .open(ResourceImageDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
