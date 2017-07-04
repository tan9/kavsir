import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoicePopupService } from './question-choice-popup.service';
import { QuestionChoiceService } from './question-choice.service';

@Component({
    selector: 'jhi-question-choice-delete-dialog',
    templateUrl: './question-choice-delete-dialog.component.html'
})
export class QuestionChoiceDeleteDialogComponent {

    questionChoice: QuestionChoice;

    constructor(
        private questionChoiceService: QuestionChoiceService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionChoiceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionChoiceListModification',
                content: 'Deleted an questionChoice'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.questionChoice.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-question-choice-delete-popup',
    template: ''
})
export class QuestionChoiceDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoicePopupService: QuestionChoicePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.questionChoicePopupService
                .open(QuestionChoiceDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
