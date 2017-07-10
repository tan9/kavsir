package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.CategoryNodeDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity CategoryNode and its DTO CategoryNodeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CategoryNodeMapper extends EntityMapper <CategoryNodeDTO, CategoryNode> {

    @Mapping(source = "parent.id", target = "parentId")
    CategoryNodeDTO toDto(CategoryNode categoryNode); 

    @Mapping(source = "parentId", target = "parent")
    @Mapping(target = "trueOrFalses", ignore = true)
    @Mapping(target = "choices", ignore = true)
    @Mapping(target = "essays", ignore = true)
    @Mapping(target = "groups", ignore = true)
    CategoryNode toEntity(CategoryNodeDTO categoryNodeDTO); 
    default CategoryNode fromId(Long id) {
        if (id == null) {
            return null;
        }
        CategoryNode categoryNode = new CategoryNode();
        categoryNode.setId(id);
        return categoryNode;
    }
}
