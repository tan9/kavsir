import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayPopupService } from './question-essay-popup.service';
import { QuestionEssayService } from './question-essay.service';

@Component({
    selector: 'jhi-question-essay-delete-dialog',
    templateUrl: './question-essay-delete-dialog.component.html'
})
export class QuestionEssayDeleteDialogComponent {

    questionEssay: QuestionEssay;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionEssayService: QuestionEssayService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['questionEssay']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.questionEssayService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'questionEssayListModification',
                content: 'Deleted an questionEssay'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-essay-delete-popup',
    template: ''
})
export class QuestionEssayDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private questionEssayPopupService: QuestionEssayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.questionEssayPopupService
                .open(QuestionEssayDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
