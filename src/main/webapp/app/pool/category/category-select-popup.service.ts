import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CategorySelectPopupService {
  private isOpen = false;

  constructor(private modalService: NgbModal, private router: Router) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.categorySelectModalRef(component, id);
    } else {
      return this.categorySelectModalRef(component);
    }
  }

  categorySelectModalRef(component: Component, categorySelect?: number): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.categorySelected = categorySelect;
    modalRef.result.then(
      result => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
