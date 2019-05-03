package com.tj.kvasir.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link CategoryAcademicYearSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CategoryAcademicYearSearchRepositoryMockConfiguration {

    @MockBean
    private CategoryAcademicYearSearchRepository mockCategoryAcademicYearSearchRepository;

}
