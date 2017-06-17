import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { QuestionGroup } from './question-group.model';
import { QuestionGroupPopupService } from './question-group-popup.service';
import { QuestionGroupService } from './question-group.service';

@Component({
    selector: 'jhi-question-group-delete-dialog',
    templateUrl: './question-group-delete-dialog.component.html'
})
export class QuestionGroupDeleteDialogComponent {

    questionGroup: QuestionGroup;

    constructor(
        private questionGroupService: QuestionGroupService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionGroupService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionGroupListModification',
                content: 'Deleted an questionGroup'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.questionGroup.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-question-group-delete-popup',
    template: ''
})
export class QuestionGroupDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionGroupPopupService: QuestionGroupPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.questionGroupPopupService
                .open(QuestionGroupDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
