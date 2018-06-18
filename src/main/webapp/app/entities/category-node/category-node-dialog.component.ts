import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
    isSaving: boolean;

    categorynodes: CategoryNode[];

    questiontruefalses: QuestionTrueFalse[];

    questionchoices: QuestionChoice[];

    questionessays: QuestionEssay[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private categoryNodeService: CategoryNodeService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private questionChoiceService: QuestionChoiceService,
        private questionEssayService: QuestionEssayService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryNodeService.query()
            .subscribe((res: HttpResponse<CategoryNode[]>) => { this.categorynodes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionTrueFalseService.query()
            .subscribe((res: HttpResponse<QuestionTrueFalse[]>) => { this.questiontruefalses = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionChoiceService.query()
            .subscribe((res: HttpResponse<QuestionChoice[]>) => { this.questionchoices = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionEssayService.query()
            .subscribe((res: HttpResponse<QuestionEssay[]>) => { this.questionessays = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionGroupService.query()
            .subscribe((res: HttpResponse<QuestionGroup[]>) => { this.questiongroups = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.categoryNode.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryNodeService.update(this.categoryNode));
        } else {
            this.subscribeToSaveResponse(
                this.categoryNodeService.create(this.categoryNode));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<CategoryNode>>) {
        result.subscribe((res: HttpResponse<CategoryNode>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryNode) {
        this.eventManager.broadcast({ name: 'categoryNodeListModification', content: 'OK'});
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryNodePopupService: CategoryNodePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categoryNodePopupService
                    .open(CategoryNodeDialogComponent as Component, params['id']);
            } else {
                this.categoryNodePopupService
                    .open(CategoryNodeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
