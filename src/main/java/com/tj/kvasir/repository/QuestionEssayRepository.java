package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionEssay;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

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

}
