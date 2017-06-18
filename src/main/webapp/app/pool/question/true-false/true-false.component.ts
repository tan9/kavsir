import { Component, OnInit } from '@angular/core';
import { QuestionTrueFalseComponent } from '../../../entities/question-true-false/question-true-false.component';

@Component({
    selector: 'jhi-true-false',
    templateUrl: './true-false.component.html',
    providers: [QuestionTrueFalseComponent],
    styles: []
})
export class TrueFalseComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
