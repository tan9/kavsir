import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoicePopupService } from './question-choice-popup.service';
import { QuestionChoiceService } from './question-choice.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';

@Component({
    selector: 'jhi-question-choice-dialog',
    templateUrl: './question-choice-dialog.component.html'
})
export class QuestionChoiceDialogComponent implements OnInit {

    questionChoice: QuestionChoice;
    authorities: any[];
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private questionChoiceService: QuestionChoiceService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionChoice']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryNodeService.query().subscribe(
            (res: Response) => { this.categorynodes = res.json(); }, (res: Response) => this.onError(res.json()));
        this.resourceImageService.query().subscribe(
            (res: Response) => { this.resourceimages = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionGroupService.query().subscribe(
            (res: Response) => { this.questiongroups = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.questionChoice.id !== undefined) {
            this.questionChoiceService.update(this.questionChoice)
                .subscribe((res: QuestionChoice) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.questionChoiceService.create(this.questionChoice)
                .subscribe((res: QuestionChoice) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess (result: QuestionChoice) {
        this.eventManager.broadcast({ name: 'questionChoiceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private questionChoicePopupService: QuestionChoicePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.questionChoicePopupService
                    .open(QuestionChoiceDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionChoicePopupService
                    .open(QuestionChoiceDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
