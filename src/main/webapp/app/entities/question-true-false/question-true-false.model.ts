import { BaseEntity } from './../../shared';

export class QuestionTrueFalse implements BaseEntity {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: string,
        public memo?: string,
        public groupPosition?: number,
        public categories?: BaseEntity[],
        public images?: BaseEntity[],
        public questionGroup?: BaseEntity,
    ) {
        this.correct = false;
    }
}
