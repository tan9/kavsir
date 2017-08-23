package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryGrade;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CategoryGrade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryGradeRepository extends JpaRepository<CategoryGrade, Long> {

}
