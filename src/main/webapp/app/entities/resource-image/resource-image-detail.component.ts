import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager , JhiLanguageService , DataUtils } from 'ng-jhipster';

import { ResourceImage } from './resource-image.model';
import { ResourceImageService } from './resource-image.service';

@Component({
    selector: 'jhi-resource-image-detail',
    templateUrl: './resource-image-detail.component.html'
})
export class ResourceImageDetailComponent implements OnInit, OnDestroy {

    resourceImage: ResourceImage;
    private subscription: any;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private resourceImageService: ResourceImageService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['resourceImage']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInResourceImages();
    }

    load (id) {
        this.resourceImageService.find(id).subscribe(resourceImage => {
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInResourceImages() {
        this.eventSubscriber = this.eventManager.subscribe('resourceImageListModification', response => this.load(this.resourceImage.id));
    }

}
