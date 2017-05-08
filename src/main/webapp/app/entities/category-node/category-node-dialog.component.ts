import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { CategoryNode } from './category-node.model';
import { CategoryNodePopupService } from './category-node-popup.service';
import { CategoryNodeService } from './category-node.service';
import { QuestionTrueFalse, QuestionTrueFalseService } from '../question-true-false';
import { QuestionChoice, QuestionChoiceService } from '../question-choice';
import { QuestionEssay, QuestionEssayService } from '../question-essay';
import { QuestionGroup, QuestionGroupService } from '../question-group';

@Component({
    selector: 'jhi-category-node-dialog',
    templateUrl: './category-node-dialog.component.html'
})
export class CategoryNodeDialogComponent implements OnInit {

    categoryNode: CategoryNode;
    authorities: any[];
    isSaving: boolean;

    questiontruefalses: QuestionTrueFalse[];

    questionchoices: QuestionChoice[];

    questionessays: QuestionEssay[];

    questiongroups: QuestionGroup[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private categoryNodeService: CategoryNodeService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private questionChoiceService: QuestionChoiceService,
        private questionEssayService: QuestionEssayService,
        private questionGroupService: QuestionGroupService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['categoryNode', 'categoryType']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.questionTrueFalseService.query().subscribe(
            (res: Response) => { this.questiontruefalses = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionChoiceService.query().subscribe(
            (res: Response) => { this.questionchoices = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionEssayService.query().subscribe(
            (res: Response) => { this.questionessays = res.json(); }, (res: Response) => this.onError(res.json()));
        this.questionGroupService.query().subscribe(
            (res: Response) => { this.questiongroups = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.categoryNode.id !== undefined) {
            this.categoryNodeService.update(this.categoryNode)
                .subscribe((res: CategoryNode) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.categoryNodeService.create(this.categoryNode)
                .subscribe((res: CategoryNode) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }
    }

    private onSaveSuccess (result: CategoryNode) {
        this.eventManager.broadcast({ name: 'categoryNodeListModification', content: 'OK'});
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

    trackQuestionTrueFalseById(index: number, item: QuestionTrueFalse) {
        return item.id;
    }

    trackQuestionChoiceById(index: number, item: QuestionChoice) {
        return item.id;
    }

    trackQuestionEssayById(index: number, item: QuestionEssay) {
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
    selector: 'jhi-category-node-popup',
    template: ''
})
export class CategoryNodePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private categoryNodePopupService: CategoryNodePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.categoryNodePopupService
                    .open(CategoryNodeDialogComponent, params['id']);
            } else {
                this.modalRef = this.categoryNodePopupService
                    .open(CategoryNodeDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
