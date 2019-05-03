import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from './question-group.service';

@Component({
  selector: 'jhi-question-group-delete-dialog',
  templateUrl: './question-group-delete-dialog.component.html'
})
export class QuestionGroupDeleteDialogComponent {
  questionGroup: IQuestionGroup;

  constructor(
    protected questionGroupService: QuestionGroupService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.questionGroupService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'questionGroupListModification',
        content: 'Deleted an questionGroup'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-question-group-delete-popup',
  template: ''
})
export class QuestionGroupDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionGroup }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(QuestionGroupDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.questionGroup = questionGroup;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/question-group', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/question-group', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
