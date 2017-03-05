import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionPopupService } from './question-choice-option-popup.service';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Component({
    selector: 'jhi-question-choice-option-delete-dialog',
    templateUrl: './question-choice-option-delete-dialog.component.html'
})
export class QuestionChoiceOptionDeleteDialogComponent {

    questionChoiceOption: QuestionChoiceOption;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionChoiceOption']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.questionChoiceOptionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'questionChoiceOptionListModification',
                content: 'Deleted an questionChoiceOption'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-choice-option-delete-popup',
    template: ''
})
export class QuestionChoiceOptionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private questionChoiceOptionPopupService: QuestionChoiceOptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.questionChoiceOptionPopupService
                .open(QuestionChoiceOptionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
