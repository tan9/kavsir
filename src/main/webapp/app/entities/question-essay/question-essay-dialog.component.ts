import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayPopupService } from './question-essay-popup.service';
import { QuestionEssayService } from './question-essay.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-essay-dialog',
    templateUrl: './question-essay-dialog.component.html'
})
export class QuestionEssayDialogComponent implements OnInit {

    questionEssay: QuestionEssay;
    authorities: any[];
    isSaving: boolean;
    inGroup = true;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private questionEssayService: QuestionEssayService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.inGroup = this.route.snapshot.queryParams['group'] !== 'false';
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
        if (this.questionEssay.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionEssayService.update(this.questionEssay), false);
        } else {
            this.subscribeToSaveResponse(
                this.questionEssayService.create(this.questionEssay), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionEssay>, isCreated: boolean) {
        result.subscribe((res: QuestionEssay) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionEssay, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.questionEssay.created'
            : 'kavsirApp.questionEssay.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'questionEssayListModification', content: 'OK'});
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
    selector: 'jhi-question-essay-popup',
    template: ''
})
export class QuestionEssayPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionEssayPopupService: QuestionEssayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.questionEssayPopupService
                    .open(QuestionEssayDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionEssayPopupService
                    .open(QuestionEssayDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
