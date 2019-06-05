package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryGrade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CategoryGrade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryGradeRepository extends JpaRepository<CategoryGrade, Long> {

}
