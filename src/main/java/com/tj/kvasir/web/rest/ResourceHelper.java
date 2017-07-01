package com.tj.kvasir.web.rest;

import com.tj.kvasir.repository.CategoryNodeRepository;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ResourceHelper {

    private final CategoryNodeRepository categoryNodeRepository;

    public ResourceHelper(CategoryNodeRepository categoryNodeRepository) {
        this.categoryNodeRepository = categoryNodeRepository;
    }

    public Set<Long> includeChildren(Set<Long> categoryIds) {
        return categoryNodeRepository.findAllChildNodes(categoryIds)
            .stream()
            .map(node -> node.getId())
            .collect(Collectors.toSet());
    }

    public TermsQueryBuilder asCategoriesFilter(Set<Long> categoryIds) {
        long[] targetCategoryIds = includeChildren(categoryIds).stream().mapToLong(id -> id).toArray();
        return QueryBuilders.termsQuery("categories.id", targetCategoryIds);
    }

}
