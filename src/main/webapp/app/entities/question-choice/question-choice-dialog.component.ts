import { Component, OnInit, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoicePopupService } from './question-choice-popup.service';
import { QuestionChoiceService } from './question-choice.service';
import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup, QuestionGroupService } from '../question-group';
import { ResponseWrapper } from '../../shared';
import { ChoiceOptionsComponent } from '../../shared/question/choice-options.component';
import { QuestionChoiceOptionService } from '../question-choice-option/question-choice-option.service';
import { CategoryHierarchyService } from '../../shared/category/category-hierarchy.service';
import { ImagesComponent } from '../../shared/image/images.component';

@Component({
    selector: 'jhi-question-choice-dialog',
    templateUrl: './question-choice-dialog.component.html'
})
export class QuestionChoiceDialogComponent implements OnInit {

    questionChoice: QuestionChoice;
    authorities: any[];
    isSaving: boolean;
    inGroup = false;
    multi: boolean; /* valid values: true, false, undefined (not specified) */

    categorynodes: CategoryNode[];

    questiongroups: QuestionGroup[];

    @ViewChild(forwardRef(() => ChoiceOptionsComponent)) options: ChoiceOptionsComponent;

    @ViewChild(forwardRef(() => ImagesComponent)) images: ImagesComponent;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionChoiceService: QuestionChoiceService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private categoryHierarchyService: CategoryHierarchyService,
        private questionGroupService: QuestionGroupService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    optionAnswerValid() {
        return !this.options ||
            (this.options.choiceOptions && this.options.choiceOptions.some((option) => option.correct));
    }

    optionAnswerForSingleChoiceValid() {
        return this.questionChoice.multipleResponse ||
            (this.options.choiceOptions && this.options.choiceOptions.filter((option) => option.correct).length <= 1);
    }

    optionNumberValid() {
        // FIXME avoid hard-coded threshold, and find out how to apply to i18n message
        return !this.options ||
            (this.options.choiceOptions && this.options.choiceOptions.length >= 4);
    }

    ngOnInit() {
        this.isSaving = false;
        this.inGroup = this.route.snapshot.queryParams['group'] !== 'false';
        let multi = this.route.snapshot.queryParams['multi'];

        if (multi !== undefined) {
            this.multi = ('true' === multi);
            this.questionChoice.multipleResponse = this.multi;
        }
        if (this.categoryHierarchyService.getWorkingCategory() &&
            (!this.questionChoice.categories || this.questionChoice.categories.length === 0)) {
            this.questionChoice.categories = [this.categoryHierarchyService.getWorkingCategory()];
        }

        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
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

    setFileData(event, questionChoice, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                questionChoice[field] = base64Data;
                questionChoice[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.options.editable = false;
        if (this.questionChoice.id !== undefined) {
            const result = this.images.save(this.questionChoice, 'choices').flatMap(
                () => this.questionChoiceService.update(this.questionChoice));
            this.subscribeToSaveResponse(result, false);
        } else {
            const create = this.images.save(this.questionChoice, 'choices').flatMap(
                () => this.questionChoiceService.create(this.questionChoice));
            this.subscribeToSaveResponse(create, true);
        }
    }

    private saveOptions(questionChoice: QuestionChoice) : Promise<any> {
        // TODO use Observable instead?
        const promises: Promise<any>[] = [];

        this.options.choiceOptions.forEach((option) => {
            option.questionChoice = questionChoice;
            if (option.id) {
                promises.push(this.questionChoiceOptionService.update(option).toPromise());
            } else {
                promises.push(this.questionChoiceOptionService.create(option).toPromise());
            }
        });
        this.options.optionsDeleted.forEach((option) => {
            if (option.id) {
                promises.push(this.questionChoiceOptionService.delete(option.id).toPromise());
            }
        });

        return Promise.all(promises);
    }

    private subscribeToSaveResponse(result: Observable<QuestionChoice>, isCreated: boolean) {
        result.subscribe((res: QuestionChoice) =>
            this.saveOptions(res).then(
                () => this.onSaveSuccess(res, isCreated),
                () => this.onSaveError(res)
            ), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionChoice, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.questionChoice.created'
            : 'kavsirApp.questionChoice.updated',
            { param : result.id }, null);

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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoicePopupService: QuestionChoicePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
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
