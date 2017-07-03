import { Component, OnInit, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayPopupService } from './question-essay-popup.service';
import { QuestionEssayService } from './question-essay.service';
import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper, CategoryHierarchyService } from '../../shared';
import { ImagesComponent } from '../../shared/image/images.component';

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

    questiongroups: QuestionGroup[];

    @ViewChild(forwardRef(() => ImagesComponent)) images: ImagesComponent;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionEssayService: QuestionEssayService,
        private categoryHierarchyService: CategoryHierarchyService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.inGroup = this.route.snapshot.queryParams['group'] !== 'false';
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

        if (this.categoryHierarchyService.getWorkingCategory() &&
            (!this.questionEssay.categories || this.questionEssay.categories.length === 0)) {
            this.questionEssay.categories = [this.categoryHierarchyService.getWorkingCategory()];
        }

        this.categorynodes = this.categoryHierarchyService.getNodes();
        this.questionGroupService.query()
            .subscribe((res: ResponseWrapper) => { this.questiongroups = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, questionEssay, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                questionEssay[field] = base64Data;
                questionEssay[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionEssay.id !== undefined) {
            this.subscribeToSaveResponse(
                this.images.save(this.questionEssay, 'essays').flatMap(
                    () => this.questionEssayService.update(this.questionEssay)),
                false);
        } else {
            this.subscribeToSaveResponse(
                this.images.save(this.questionEssay, 'essays').flatMap(
                    () => this.questionEssayService.create(this.questionEssay)),
                true);
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
