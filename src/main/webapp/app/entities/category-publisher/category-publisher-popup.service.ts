import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherService } from './category-publisher.service';

@Injectable()
export class CategoryPublisherPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categoryPublisherService: CategoryPublisherService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.categoryPublisherService.find(id)
                    .subscribe((categoryPublisherResponse: HttpResponse<CategoryPublisher>) => {
                        const categoryPublisher: CategoryPublisher = categoryPublisherResponse.body;
                        this.ngbModalRef = this.categoryPublisherModalRef(component, categoryPublisher);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.categoryPublisherModalRef(component, new CategoryPublisher());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    categoryPublisherModalRef(component: Component, categoryPublisher: CategoryPublisher): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categoryPublisher = categoryPublisher;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
