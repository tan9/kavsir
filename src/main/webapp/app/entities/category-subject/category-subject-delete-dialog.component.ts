import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySubject } from './category-subject.model';
import { CategorySubjectPopupService } from './category-subject-popup.service';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-delete-dialog',
    templateUrl: './category-subject-delete-dialog.component.html'
})
export class CategorySubjectDeleteDialogComponent {

    categorySubject: CategorySubject;

    constructor(
        private categorySubjectService: CategorySubjectService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categorySubjectService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categorySubjectListModification',
                content: 'Deleted an categorySubject'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-category-subject-delete-popup',
    template: ''
})
export class CategorySubjectDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySubjectPopupService: CategorySubjectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categorySubjectPopupService
                .open(CategorySubjectDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
