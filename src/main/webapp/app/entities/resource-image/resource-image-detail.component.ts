import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { ResourceImage } from './resource-image.model';
import { ResourceImageService } from './resource-image.service';

@Component({
    selector: 'jhi-resource-image-detail',
    templateUrl: './resource-image-detail.component.html'
})
export class ResourceImageDetailComponent implements OnInit, OnDestroy {

    resourceImage: ResourceImage;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private resourceImageService: ResourceImageService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInResourceImages();
    }

    load(id) {
        this.resourceImageService.find(id)
            .subscribe((resourceImageResponse: HttpResponse<ResourceImage>) => {
                this.resourceImage = resourceImageResponse.body;
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInResourceImages() {
        this.eventSubscriber = this.eventManager.subscribe(
            'resourceImageListModification',
            (response) => this.load(this.resourceImage.id)
        );
    }
}
