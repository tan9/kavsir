import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayPopupService } from './question-essay-popup.service';
import { QuestionEssayService } from './question-essay.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResourceImage, ResourceImageService } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
@Component({
    selector: 'jhi-question-essay-dialog',
    templateUrl: './question-essay-dialog.component.html'
})
export class QuestionEssayDialogComponent implements OnInit {

    questionEssay: QuestionEssay;
    authorities: any[];
    isSaving: boolean;

    categorynodes: CategoryNode[];

    resourceimages: ResourceImage[];

    questiongroups: QuestionGroup[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private questionEssayService: QuestionEssayService,
        private categoryNodeService: CategoryNodeService,
        private resourceImageService: ResourceImageService,
        private questionGroupService: QuestionGroupService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionEssay']);
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
        if (this.questionEssay.id !== undefined) {
            this.questionEssayService.update(this.questionEssay)
                .subscribe((res: QuestionEssay) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.questionEssayService.create(this.questionEssay)
                .subscribe((res: QuestionEssay) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: QuestionEssay) {
        this.eventManager.broadcast({ name: 'questionEssayListModification', content: 'OK'});
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

    constructor (
        private route: ActivatedRoute,
        private questionEssayPopupService: QuestionEssayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
