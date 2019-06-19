package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.QuestionTrueFalseDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link QuestionTrueFalse} and its DTO {@link QuestionTrueFalseDTO}.
 */
@Mapper(componentModel = "spring", uses = {CategoryNodeMapper.class, ResourceImageMapper.class, QuestionGroupMapper.class})
public interface QuestionTrueFalseMapper extends EntityMapper<QuestionTrueFalseDTO, QuestionTrueFalse> {

    @Mapping(source = "questionGroup.id", target = "questionGroupId")
    QuestionTrueFalseDTO toDto(QuestionTrueFalse questionTrueFalse);

    @Mapping(target = "removeCategory", ignore = true)
    @Mapping(target = "removeImage", ignore = true)
    @Mapping(source = "questionGroupId", target = "questionGroup")
    QuestionTrueFalse toEntity(QuestionTrueFalseDTO questionTrueFalseDTO);

    default QuestionTrueFalse fromId(Long id) {
        if (id == null) {
            return null;
        }
        QuestionTrueFalse questionTrueFalse = new QuestionTrueFalse();
        questionTrueFalse.setId(id);
        return questionTrueFalse;
    }
}
