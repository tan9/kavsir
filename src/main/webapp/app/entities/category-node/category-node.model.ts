import { BaseEntity } from './../../shared';

export enum CategoryType {
    ACADEMIC_YEAR = 'ACADEMIC_YEAR',
    GRADE = 'GRADE' ,
    SEMESTER = 'SEMESTER' ,
    SUBJECT = 'SUBJECT',
    SOURCE = 'SOURCE',
    SEGMENT = 'SEGMENT'
}

export class CategoryNode implements BaseEntity {
    constructor(
        public id?: number,
        public type?: CategoryType,
        public typeId?: number,
        public name?: string,
        public position?: number,
        public parentId?: number,
        public trueOrFalses?: BaseEntity[],
        public choices?: BaseEntity[],
        public essays?: BaseEntity[],
        public groups?: BaseEntity[],
    ) {
    }
}
