package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.ResourceImageDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link ResourceImage} and its DTO {@link ResourceImageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ResourceImageMapper extends EntityMapper<ResourceImageDTO, ResourceImage> {


    @Mapping(target = "choices", ignore = true)
    @Mapping(target = "removeChoice", ignore = true)
    @Mapping(target = "choiceOptions", ignore = true)
    @Mapping(target = "removeChoiceOption", ignore = true)
    @Mapping(target = "trueFalses", ignore = true)
    @Mapping(target = "removeTrueFalse", ignore = true)
    @Mapping(target = "essays", ignore = true)
    @Mapping(target = "removeEssay", ignore = true)
    ResourceImage toEntity(ResourceImageDTO resourceImageDTO);

    default ResourceImage fromId(Long id) {
        if (id == null) {
            return null;
        }
        ResourceImage resourceImage = new ResourceImage();
        resourceImage.setId(id);
        return resourceImage;
    }
}
