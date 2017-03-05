package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryAcademicYear;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategoryAcademicYear entity.
 */
@SuppressWarnings("unused")
public interface CategoryAcademicYearRepository extends JpaRepository<CategoryAcademicYear,Long> {

}
