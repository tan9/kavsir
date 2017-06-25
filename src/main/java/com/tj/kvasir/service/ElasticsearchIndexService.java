package com.tj.kvasir.service;

import com.codahale.metrics.annotation.Timed;
import com.tj.kvasir.domain.*;
import com.tj.kvasir.repository.*;
import com.tj.kvasir.repository.search.*;
import org.elasticsearch.indices.IndexAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.List;

@Service
public class ElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final CategoryAcademicYearRepository categoryAcademicYearRepository;

    private final CategoryAcademicYearSearchRepository categoryAcademicYearSearchRepository;

    private final CategoryGradeRepository categoryGradeRepository;

    private final CategoryGradeSearchRepository categoryGradeSearchRepository;

    private final CategoryNodeRepository categoryNodeRepository;

    private final CategoryNodeSearchRepository categoryNodeSearchRepository;

    private final CategoryPublisherRepository categoryPublisherRepository;

    private final CategoryPublisherSearchRepository categoryPublisherSearchRepository;

    private final CategorySemesterRepository categorySemesterRepository;

    private final CategorySemesterSearchRepository categorySemesterSearchRepository;

    private final CategorySubjectRepository categorySubjectRepository;

    private final CategorySubjectSearchRepository categorySubjectSearchRepository;

    private final QuestionChoiceRepository questionChoiceRepository;

    private final QuestionChoiceSearchRepository questionChoiceSearchRepository;

    private final QuestionChoiceOptionRepository questionChoiceOptionRepository;

    private final QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository;

    private final QuestionEssayRepository questionEssayRepository;

    private final QuestionEssaySearchRepository questionEssaySearchRepository;

    private final QuestionGroupRepository questionGroupRepository;

    private final QuestionGroupSearchRepository questionGroupSearchRepository;

    private final QuestionTrueFalseRepository questionTrueFalseRepository;

    private final QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository;

    private final ResourceImageRepository resourceImageRepository;

    private final ResourceImageSearchRepository resourceImageSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        CategoryAcademicYearRepository categoryAcademicYearRepository,
        CategoryAcademicYearSearchRepository categoryAcademicYearSearchRepository,
        CategoryGradeRepository categoryGradeRepository,
        CategoryGradeSearchRepository categoryGradeSearchRepository,
        CategoryNodeRepository categoryNodeRepository,
        CategoryNodeSearchRepository categoryNodeSearchRepository,
        CategoryPublisherRepository categoryPublisherRepository,
        CategoryPublisherSearchRepository categoryPublisherSearchRepository,
        CategorySemesterRepository categorySemesterRepository,
        CategorySemesterSearchRepository categorySemesterSearchRepository,
        CategorySubjectRepository categorySubjectRepository,
        CategorySubjectSearchRepository categorySubjectSearchRepository,
        QuestionChoiceRepository questionChoiceRepository,
        QuestionChoiceSearchRepository questionChoiceSearchRepository,
        QuestionChoiceOptionRepository questionChoiceOptionRepository,
        QuestionChoiceOptionSearchRepository questionChoiceOptionSearchRepository,
        QuestionEssayRepository questionEssayRepository,
        QuestionEssaySearchRepository questionEssaySearchRepository,
        QuestionGroupRepository questionGroupRepository,
        QuestionGroupSearchRepository questionGroupSearchRepository,
        QuestionTrueFalseRepository questionTrueFalseRepository,
        QuestionTrueFalseSearchRepository questionTrueFalseSearchRepository,
        ResourceImageRepository resourceImageRepository,
        ResourceImageSearchRepository resourceImageSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.categoryAcademicYearRepository = categoryAcademicYearRepository;
        this.categoryAcademicYearSearchRepository = categoryAcademicYearSearchRepository;
        this.categoryGradeRepository = categoryGradeRepository;
        this.categoryGradeSearchRepository = categoryGradeSearchRepository;
        this.categoryNodeRepository = categoryNodeRepository;
        this.categoryNodeSearchRepository = categoryNodeSearchRepository;
        this.categoryPublisherRepository = categoryPublisherRepository;
        this.categoryPublisherSearchRepository = categoryPublisherSearchRepository;
        this.categorySemesterRepository = categorySemesterRepository;
        this.categorySemesterSearchRepository = categorySemesterSearchRepository;
        this.categorySubjectRepository = categorySubjectRepository;
        this.categorySubjectSearchRepository = categorySubjectSearchRepository;
        this.questionChoiceRepository = questionChoiceRepository;
        this.questionChoiceSearchRepository = questionChoiceSearchRepository;
        this.questionChoiceOptionRepository = questionChoiceOptionRepository;
        this.questionChoiceOptionSearchRepository = questionChoiceOptionSearchRepository;
        this.questionEssayRepository = questionEssayRepository;
        this.questionEssaySearchRepository = questionEssaySearchRepository;
        this.questionGroupRepository = questionGroupRepository;
        this.questionGroupSearchRepository = questionGroupSearchRepository;
        this.questionTrueFalseRepository = questionTrueFalseRepository;
        this.questionTrueFalseSearchRepository = questionTrueFalseSearchRepository;
        this.resourceImageRepository = resourceImageRepository;
        this.resourceImageSearchRepository = resourceImageSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    @Timed
    public void reindexAll() {
        reindexForClass(CategoryAcademicYear.class, categoryAcademicYearRepository, categoryAcademicYearSearchRepository);
        reindexForClass(CategoryGrade.class, categoryGradeRepository, categoryGradeSearchRepository);
        reindexForClass(CategoryNode.class, categoryNodeRepository, categoryNodeSearchRepository);
        reindexForClass(CategoryPublisher.class, categoryPublisherRepository, categoryPublisherSearchRepository);
        reindexForClass(CategorySemester.class, categorySemesterRepository, categorySemesterSearchRepository);
        reindexForClass(CategorySubject.class, categorySubjectRepository, categorySubjectSearchRepository);
        reindexForClass(QuestionChoice.class, questionChoiceRepository, questionChoiceSearchRepository);
        reindexForClass(QuestionChoiceOption.class, questionChoiceOptionRepository, questionChoiceOptionSearchRepository);
        reindexForClass(QuestionEssay.class, questionEssayRepository, questionEssaySearchRepository);
        reindexForClass(QuestionGroup.class, questionGroupRepository, questionGroupSearchRepository);
        reindexForClass(QuestionTrueFalse.class, questionTrueFalseRepository, questionTrueFalseSearchRepository);
        reindexForClass(ResourceImage.class, resourceImageRepository, resourceImageSearchRepository);
        reindexForClass(User.class, userRepository, userSearchRepository);

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
                                                              ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        try {
            elasticsearchTemplate.createIndex(entityClass);
        } catch (IndexAlreadyExistsException e) {
            // Do nothing. Index was already concurrently recreated by some other service.
        }
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            try {
                Method m = jpaRepository.getClass().getMethod("findAllWithEagerRelationships");
                elasticsearchRepository.save((List<T>) m.invoke(jpaRepository));
            } catch (Exception e) {
                elasticsearchRepository.save(jpaRepository.findAll());
            }
        }
        log.info("Elasticsearch: Indexed all rows for " + entityClass.getSimpleName());
    }
}
