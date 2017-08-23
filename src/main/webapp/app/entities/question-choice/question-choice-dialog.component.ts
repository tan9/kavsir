import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoicePopupService } from './question-choice-popup.service';
import { QuestionChoiceService } from './question-choice.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-choice-dialog',
    templateUrl: './question-choice-dialog.component.html'
})
export class QuestionChoiceDialogComponent implements OnInit {

    questionChoice: QuestionChoice;
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionChoiceService: QuestionChoiceService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryNodeService.query()
            .subscribe((res: ResponseWrapper) => { this.categorynodes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.resourceImageService.query()
            .subscribe((res: ResponseWrapper) => { this.resourceimages = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.questionGroupService.query()
            .subscribe((res: ResponseWrapper) => { this.questiongroups = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
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
        if (this.questionChoice.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionChoiceService.update(this.questionChoice));
        } else {
            this.subscribeToSaveResponse(
                this.questionChoiceService.create(this.questionChoice));
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionChoice>) {
        result.subscribe((res: QuestionChoice) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionChoice) {
        this.eventManager.broadcast({ name: 'questionChoiceListModification', content: 'OK'});
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
    selector: 'jhi-question-choice-popup',
    template: ''
})
export class QuestionChoicePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoicePopupService: QuestionChoicePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.questionChoicePopupService
                    .open(QuestionChoiceDialogComponent as Component, params['id']);
            } else {
                this.questionChoicePopupService
                    .open(QuestionChoiceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
