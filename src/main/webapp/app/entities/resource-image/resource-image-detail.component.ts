import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IResourceImage } from 'app/shared/model/resource-image.model';

@Component({
  selector: 'jhi-resource-image-detail',
  templateUrl: './resource-image-detail.component.html'
})
export class ResourceImageDetailComponent implements OnInit {
  resourceImage: IResourceImage;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ resourceImage }) => {
      this.resourceImage = resourceImage;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
