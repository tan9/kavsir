import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
    selector: 'jhi-category-academic-year-detail',
    templateUrl: './category-academic-year-detail.component.html'
})
export class CategoryAcademicYearDetailComponent implements OnInit, OnDestroy {

    categoryAcademicYear: CategoryAcademicYear;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categoryAcademicYearService: CategoryAcademicYearService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categoryAcademicYear']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.categoryAcademicYearService.find(id).subscribe(categoryAcademicYear => {
            this.categoryAcademicYear = categoryAcademicYear;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
