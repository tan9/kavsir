import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from './resource-image.service';

@Component({
  selector: 'jhi-resource-image-delete-dialog',
  templateUrl: './resource-image-delete-dialog.component.html'
})
export class ResourceImageDeleteDialogComponent {
  resourceImage: IResourceImage;

  constructor(
    protected resourceImageService: ResourceImageService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.resourceImageService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'resourceImageListModification',
        content: 'Deleted an resourceImage'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-resource-image-delete-popup',
  template: ''
})
export class ResourceImageDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ resourceImage }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ResourceImageDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.resourceImage = resourceImage;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/resource-image', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/resource-image', { outlets: { popup: null } }]);
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
