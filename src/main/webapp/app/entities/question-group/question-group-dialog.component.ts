import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { QuestionGroup } from './question-group.model';
import { QuestionGroupPopupService } from './question-group-popup.service';
import { QuestionGroupService } from './question-group.service';
import { CategoryNode, CategoryNodeService } from '../category-node';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-group-dialog',
    templateUrl: './question-group-dialog.component.html'
})
export class QuestionGroupDialogComponent implements OnInit {

    questionGroup: QuestionGroup;
    authorities: any[];
    isSaving: boolean;

    categorynodes: CategoryNode[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private questionGroupService: QuestionGroupService,
        private categoryNodeService: CategoryNodeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryNodeService.query()
            .subscribe((res: ResponseWrapper) => { this.categorynodes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, questionGroup, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                questionGroup[field] = base64Data;
                questionGroup[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionGroup.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionGroupService.update(this.questionGroup));
        } else {
            this.subscribeToSaveResponse(
                this.questionGroupService.create(this.questionGroup));
        }
    }

    private subscribeToSaveResponse(result: Observable<QuestionGroup>) {
        result.subscribe((res: QuestionGroup) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: QuestionGroup) {
        this.eventManager.broadcast({ name: 'questionGroupListModification', content: 'OK'});
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

    constructor(
        private route: ActivatedRoute,
        private questionGroupPopupService: QuestionGroupPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
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
