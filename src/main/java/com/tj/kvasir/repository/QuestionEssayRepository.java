package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionEssay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

/**
 * Spring Data JPA repository for the QuestionEssay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionEssayRepository extends JpaRepository<QuestionEssay, Long> {

    @Query("select distinct question_essay from QuestionEssay question_essay left join fetch question_essay.categories left join fetch question_essay.images")
    List<QuestionEssay> findAllWithEagerRelationships();

    @Query("select question_essay from QuestionEssay question_essay left join fetch question_essay.categories left join fetch question_essay.images where question_essay.id =:id")
    QuestionEssay findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT question_essay FROM QuestionEssay question_essay LEFT JOIN question_essay.categories category WHERE category.id IN (:categoryIds)")
    Page<QuestionEssay> findAllByCategories(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

}
