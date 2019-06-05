package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data  repository for the QuestionChoice entity.
 */
@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Long> {

    @Query(value = "select distinct questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images",
        countQuery = "select count(distinct questionChoice) from QuestionChoice questionChoice")
    Page<QuestionChoice> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images")
    List<QuestionChoice> findAllWithEagerRelationships();

    @Query("select questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images where questionChoice.id =:id")
    Optional<QuestionChoice> findOneWithEagerRelationships(@Param("id") Long id);

    Page<QuestionChoice> findAllByMultipleResponse(boolean multipleResponse, Pageable pageable);

    @Query("SELECT DISTINCT question_choice FROM QuestionChoice question_choice LEFT JOIN question_choice.categories category WHERE category.id IN (:categoryIds)")
    Page<QuestionChoice> findAllByCategories(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT question_choice FROM QuestionChoice question_choice LEFT JOIN question_choice.categories category WHERE question_choice.multipleResponse = :multipleResponse AND  category.id IN (:categoryIds)")
    Page<QuestionChoice> findAllByCategoriesAndMultipleResponse(@Param("categoryIds") Set<Long> categoryIds,
                                                             @Param("multipleResponse") boolean multipleResponse,
                                                             Pageable pageable);

}
