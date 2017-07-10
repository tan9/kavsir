import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionPopupService } from './question-choice-option-popup.service';
import { QuestionChoiceOptionService } from './question-choice-option.service';
import { QuestionChoice } from '../question-choice/question-choice.model';
import { QuestionChoiceService } from '../question-choice/question-choice.service';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-choice-option-dialog',
    templateUrl: './question-choice-option-dialog.component.html'
})
export class QuestionChoiceOptionDialogComponent implements OnInit {

    questionChoiceOption: QuestionChoiceOption;
    authorities: any[];
    isSaving: boolean;

    questionchoices: QuestionChoice[];

    resourceimages: ResourceImage[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private questionChoiceService: QuestionChoiceService,
        private resourceImageService: ResourceImageService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.questionChoiceService.query()
            .subscribe((res: ResponseWrapper) => { this.questionchoices = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.resourceImageService.query()
            .subscribe((res: ResponseWrapper) => { this.resourceimages = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, questionChoiceOption, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                questionChoiceOption[field] = base64Data;
                questionChoiceOption[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionChoiceOption.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionChoiceOptionService.update(this.questionChoiceOption), false);
        } else {
            this.subscribeToSaveResponse(
                this.questionChoiceOptionService.create(this.questionChoiceOption), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionChoiceOption>, isCreated: boolean) {
        result.subscribe((res: QuestionChoiceOption) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionChoiceOption, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.questionChoiceOption.created'
            : 'kavsirApp.questionChoiceOption.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'questionChoiceOptionListModification', content: 'OK'});
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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoiceOptionPopupService: QuestionChoiceOptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.questionChoiceOptionPopupService
                    .open(QuestionChoiceOptionDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionChoiceOptionPopupService
                    .open(QuestionChoiceOptionDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
