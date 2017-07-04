import { BaseEntity } from './../../shared';

export class QuestionChoice implements BaseEntity {
    constructor(
        public id?: number,
        public multipleResponse?: boolean,
        public text?: any,
        public memo?: string,
        public groupPosition?: number,
        public options?: BaseEntity[],
        public categories?: BaseEntity[],
        public images?: BaseEntity[],
        public questionGroupId?: number,
    ) {
        this.multipleResponse = false;
    }
}
