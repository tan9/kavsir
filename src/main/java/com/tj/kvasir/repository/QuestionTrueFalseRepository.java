package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionTrueFalse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

/**
 * Spring Data JPA repository for the QuestionTrueFalse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionTrueFalseRepository extends JpaRepository<QuestionTrueFalse, Long> {

    @Query("select distinct question_true_false from QuestionTrueFalse question_true_false left join fetch question_true_false.categories left join fetch question_true_false.images")
    List<QuestionTrueFalse> findAllWithEagerRelationships();

    @Query("select question_true_false from QuestionTrueFalse question_true_false left join fetch question_true_false.categories left join fetch question_true_false.images where question_true_false.id =:id")
    QuestionTrueFalse findOneWithEagerRelationships(@Param("id") Long id);

    // FIXME Count not working due to the bug in QueryUtils
    @Query(name = "QuestionTrueFalse.findAllByCategoriesTree", nativeQuery = true)
    Page<QuestionTrueFalse> findAllByCategoriesTree(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT question_true_false FROM QuestionTrueFalse question_true_false LEFT JOIN question_true_false.categories category WHERE category.id IN (:categoryIds)")
    Page<QuestionTrueFalse> findAllByCategories(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

}
