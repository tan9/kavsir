import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradePopupService } from './category-grade-popup.service';
import { CategoryGradeService } from './category-grade.service';

@Component({
    selector: 'jhi-category-grade-delete-dialog',
    templateUrl: './category-grade-delete-dialog.component.html'
})
export class CategoryGradeDeleteDialogComponent {

    categoryGrade: CategoryGrade;

    constructor(
        private categoryGradeService: CategoryGradeService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categoryGradeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categoryGradeListModification',
                content: 'Deleted an categoryGrade'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.categoryGrade.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-category-grade-delete-popup',
    template: ''
})
export class CategoryGradeDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryGradePopupService: CategoryGradePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categoryGradePopupService
                .open(CategoryGradeDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
