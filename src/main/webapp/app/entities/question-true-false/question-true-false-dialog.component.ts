import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalsePopupService } from './question-true-false-popup.service';
import { QuestionTrueFalseService } from './question-true-false.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-true-false-dialog',
    templateUrl: './question-true-false-dialog.component.html'
})
export class QuestionTrueFalseDialogComponent implements OnInit {

    questionTrueFalse: QuestionTrueFalse;
    authorities: any[];
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryNodeService.query()
            .subscribe((res: ResponseWrapper) => { this.categorynodes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.resourceImageService.query()
            .subscribe((res: ResponseWrapper) => { this.resourceimages = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.questionGroupService.query()
            .subscribe((res: ResponseWrapper) => { this.questiongroups = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionTrueFalse.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionTrueFalseService.update(this.questionTrueFalse));
        } else {
            this.subscribeToSaveResponse(
                this.questionTrueFalseService.create(this.questionTrueFalse));
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionTrueFalse>) {
        result.subscribe((res: QuestionTrueFalse) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionTrueFalse) {
        this.eventManager.broadcast({ name: 'questionTrueFalseListModification', content: 'OK'});
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
    selector: 'jhi-question-true-false-popup',
    template: ''
})
export class QuestionTrueFalsePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionTrueFalsePopupService: QuestionTrueFalsePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.questionTrueFalsePopupService
                    .open(QuestionTrueFalseDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionTrueFalsePopupService
                    .open(QuestionTrueFalseDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
