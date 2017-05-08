import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryNode } from './category-node.model';
import { CategoryNodeService } from './category-node.service';
@Injectable()
export class CategoryNodePopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private categoryNodeService: CategoryNodeService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.categoryNodeService.find(id).subscribe(categoryNode => {
                this.categoryNodeModalRef(component, categoryNode);
            });
        } else {
            return this.categoryNodeModalRef(component, new CategoryNode());
        }
    }

    categoryNodeModalRef(component: Component, categoryNode: CategoryNode): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categoryNode = categoryNode;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
