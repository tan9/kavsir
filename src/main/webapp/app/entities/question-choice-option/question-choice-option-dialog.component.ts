import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

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
    authorities: any[];
    isSaving: boolean;

    questionchoices: QuestionChoice[];

    resourceimages: ResourceImage[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private questionChoiceService: QuestionChoiceService,
        private resourceImageService: ResourceImageService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionChoiceOption']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.questionChoiceService.query().subscribe(
            (res: Response) => { this.questionchoices = res.json(); }, (res: Response) => this.onError(res.json()));
        this.resourceImageService.query().subscribe(
            (res: Response) => { this.resourceimages = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.questionChoiceOption.id !== undefined) {
            this.questionChoiceOptionService.update(this.questionChoiceOption)
                .subscribe((res: QuestionChoiceOption) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.questionChoiceOptionService.create(this.questionChoiceOption)
                .subscribe((res: QuestionChoiceOption) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: QuestionChoiceOption) {
        this.eventManager.broadcast({ name: 'questionChoiceOptionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
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

    constructor (
        private route: ActivatedRoute,
        private questionChoiceOptionPopupService: QuestionChoiceOptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
