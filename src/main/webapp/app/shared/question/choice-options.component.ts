import { Component, Input } from '@angular/core';
import { IQuestionChoiceOption, QuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

@Component({
  selector: 'jhi-choice-options',
  templateUrl: './choice-options.component.html',
  styleUrls: ['./choice-options.component.scss']
})
export class ChoiceOptionsComponent {
  @Input() choiceOptions: IQuestionChoiceOption[];

  optionsDeleted: IQuestionChoiceOption[] = [];

  @Input() editable: false;

  removeOption(index: number) {
    this.optionsDeleted.push.apply(this.optionsDeleted, this.choiceOptions.splice(index, 1));
  }

  isEditing() {
    return this.choiceOptions && this.choiceOptions.some(option => option['isEditing']);
  }

  addOption() {
    const option = new QuestionChoiceOption();
    option['isEditing'] = true;
    if (!this.choiceOptions) {
      this.choiceOptions = [];
    }
    this.choiceOptions.push(option);
  }
}
