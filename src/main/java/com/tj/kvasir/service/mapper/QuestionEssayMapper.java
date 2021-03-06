package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.QuestionEssayDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link QuestionEssay} and its DTO {@link QuestionEssayDTO}.
 */
@Mapper(componentModel = "spring", uses = {CategoryNodeMapper.class, ResourceImageMapper.class, QuestionGroupMapper.class})
public interface QuestionEssayMapper extends EntityMapper<QuestionEssayDTO, QuestionEssay> {

    @Mapping(source = "questionGroup.id", target = "questionGroupId")
    QuestionEssayDTO toDto(QuestionEssay questionEssay);

    @Mapping(target = "removeCategory", ignore = true)
    @Mapping(target = "removeImage", ignore = true)
    @Mapping(source = "questionGroupId", target = "questionGroup")
    QuestionEssay toEntity(QuestionEssayDTO questionEssayDTO);

    default QuestionEssay fromId(Long id) {
        if (id == null) {
            return null;
        }
        QuestionEssay questionEssay = new QuestionEssay();
        questionEssay.setId(id);
        return questionEssay;
    }
}
