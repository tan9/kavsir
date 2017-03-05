import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { CategorySubject } from './category-subject.model';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-detail',
    templateUrl: './category-subject-detail.component.html'
})
export class CategorySubjectDetailComponent implements OnInit, OnDestroy {

    categorySubject: CategorySubject;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categorySubjectService: CategorySubjectService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categorySubject']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.categorySubjectService.find(id).subscribe(categorySubject => {
            this.categorySubject = categorySubject;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
