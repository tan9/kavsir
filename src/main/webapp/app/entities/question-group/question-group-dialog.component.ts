import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { QuestionGroup } from './question-group.model';
import { QuestionGroupPopupService } from './question-group-popup.service';
import { QuestionGroupService } from './question-group.service';
import { QuestionChoice, QuestionChoiceService } from '../question-choice';
import { QuestionTrueFalse, QuestionTrueFalseService } from '../question-true-false';
import { QuestionEssay, QuestionEssayService } from '../question-essay';
import { CategoryNode, CategoryNodeService } from '../category-node';
@Component({
    selector: 'jhi-question-group-dialog',
    templateUrl: './question-group-dialog.component.html'
})
export class QuestionGroupDialogComponent implements OnInit {

    questionGroup: QuestionGroup;
    authorities: any[];
    isSaving: boolean;

    questionchoices: QuestionChoice[];

    questiontruefalses: QuestionTrueFalse[];

    questionessays: QuestionEssay[];

    categorynodes: CategoryNode[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private questionGroupService: QuestionGroupService,
        private questionChoiceService: QuestionChoiceService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private questionEssayService: QuestionEssayService,
        private categoryNodeService: CategoryNodeService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionGroup']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.questionChoiceService.query().subscribe(
            (res: Response) => { this.questionchoices = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionTrueFalseService.query().subscribe(
            (res: Response) => { this.questiontruefalses = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionEssayService.query().subscribe(
            (res: Response) => { this.questionessays = res.json(); }, (res: Response) => this.onError(res.json()));
        this.categoryNodeService.query().subscribe(
            (res: Response) => { this.categorynodes = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.questionGroup.id !== undefined) {
            this.questionGroupService.update(this.questionGroup)
                .subscribe((res: QuestionGroup) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.questionGroupService.create(this.questionGroup)
                .subscribe((res: QuestionGroup) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: QuestionGroup) {
        this.eventManager.broadcast({ name: 'questionGroupListModification', content: 'OK'});
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

    trackQuestionTrueFalseById(index: number, item: QuestionTrueFalse) {
        return item.id;
    }

    trackQuestionEssayById(index: number, item: QuestionEssay) {
        return item.id;
    }

    trackCategoryNodeById(index: number, item: CategoryNode) {
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
    selector: 'jhi-question-group-popup',
    template: ''
})
export class QuestionGroupPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private questionGroupPopupService: QuestionGroupPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.questionGroupPopupService
                    .open(QuestionGroupDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionGroupPopupService
                    .open(QuestionGroupDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
