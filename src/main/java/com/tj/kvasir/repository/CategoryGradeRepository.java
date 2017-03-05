package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryGrade;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategoryGrade entity.
 */
@SuppressWarnings("unused")
public interface CategoryGradeRepository extends JpaRepository<CategoryGrade,Long> {

}
