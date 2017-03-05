import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { CategoryGrade } from './category-grade.model';
import { CategoryGradeService } from './category-grade.service';

@Component({
    selector: 'jhi-category-grade-detail',
    templateUrl: './category-grade-detail.component.html'
})
export class CategoryGradeDetailComponent implements OnInit, OnDestroy {

    categoryGrade: CategoryGrade;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categoryGradeService: CategoryGradeService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categoryGrade']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.categoryGradeService.find(id).subscribe(categoryGrade => {
            this.categoryGrade = categoryGrade;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
