package com.tj.kvasir.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link CategorySourceSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CategorySourceSearchRepositoryMockConfiguration {

    @MockBean
    private CategorySourceSearchRepository mockCategorySourceSearchRepository;

}
