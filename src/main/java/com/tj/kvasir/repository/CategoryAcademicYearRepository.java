package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryAcademicYear;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CategoryAcademicYear entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryAcademicYearRepository extends JpaRepository<CategoryAcademicYear,Long> {
    
}
