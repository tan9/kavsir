package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

/**
 * Spring Data JPA repository for the QuestionChoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice,Long> {

    @Query("select distinct question_choice from QuestionChoice question_choice left join fetch question_choice.categories left join fetch question_choice.images")
    List<QuestionChoice> findAllWithEagerRelationships();

    @Query("select question_choice from QuestionChoice question_choice left join fetch question_choice.categories left join fetch question_choice.images where question_choice.id =:id")
    QuestionChoice findOneWithEagerRelationships(@Param("id") Long id);

    Page<QuestionChoice> findAllByMultipleResponse(boolean multipleResponse, Pageable pageable);

    @Query("SELECT DISTINCT question_choice FROM QuestionChoice question_choice LEFT JOIN question_choice.categories category WHERE category.id IN (:categoryIds)")
    Page<QuestionChoice> findAllByCategories(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT question_choice FROM QuestionChoice question_choice LEFT JOIN question_choice.categories category WHERE question_choice.multipleResponse = :multipleResponse AND  category.id IN (:categoryIds)")
    Page<QuestionChoice> findAllByCategoriesAndMultipleResponse(@Param("categoryIds") Set<Long> categoryIds,
                                                             @Param("multipleResponse") boolean multipleResponse,
                                                             Pageable pageable);

}
