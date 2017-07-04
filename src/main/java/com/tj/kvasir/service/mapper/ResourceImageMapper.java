package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.ResourceImageDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ResourceImage and its DTO ResourceImageDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ResourceImageMapper extends EntityMapper <ResourceImageDTO, ResourceImage> {
    
    @Mapping(target = "choices", ignore = true)
    @Mapping(target = "choiceOptions", ignore = true)
    @Mapping(target = "trueFalses", ignore = true)
    @Mapping(target = "essays", ignore = true)
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
