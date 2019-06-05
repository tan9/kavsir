package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionTrueFalse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data  repository for the QuestionTrueFalse entity.
 */
@Repository
public interface QuestionTrueFalseRepository extends JpaRepository<QuestionTrueFalse, Long> {

    @Query(value = "select distinct questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images",
        countQuery = "select count(distinct questionTrueFalse) from QuestionTrueFalse questionTrueFalse")
    Page<QuestionTrueFalse> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images")
    List<QuestionTrueFalse> findAllWithEagerRelationships();

    @Query("select questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images where questionTrueFalse.id =:id")
    Optional<QuestionTrueFalse> findOneWithEagerRelationships(@Param("id") Long id);

    // FIXME Count not working due to the bug in QueryUtils
    @Query(name = "QuestionTrueFalse.findAllByCategoriesTree", nativeQuery = true)
    Page<QuestionTrueFalse> findAllByCategoriesTree(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT question_true_false FROM QuestionTrueFalse question_true_false LEFT JOIN question_true_false.categories category WHERE category.id IN (:categoryIds)")
    Page<QuestionTrueFalse> findAllByCategories(@Param("categoryIds") Set<Long> categoryIds, Pageable pageable);

}
