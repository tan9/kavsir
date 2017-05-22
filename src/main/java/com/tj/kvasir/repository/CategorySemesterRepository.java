package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategorySemester;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategorySemester entity.
 */
@SuppressWarnings("unused")
public interface CategorySemesterRepository extends JpaRepository<CategorySemester,Long> {

}
