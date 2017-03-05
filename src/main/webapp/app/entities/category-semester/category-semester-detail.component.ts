import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { CategorySemester } from './category-semester.model';
import { CategorySemesterService } from './category-semester.service';

@Component({
    selector: 'jhi-category-semester-detail',
    templateUrl: './category-semester-detail.component.html'
})
export class CategorySemesterDetailComponent implements OnInit, OnDestroy {

    categorySemester: CategorySemester;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categorySemesterService: CategorySemesterService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categorySemester']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.categorySemesterService.find(id).subscribe(categorySemester => {
            this.categorySemester = categorySemester;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
