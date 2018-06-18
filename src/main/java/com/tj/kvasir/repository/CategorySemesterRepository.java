package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategorySemester;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CategorySemester entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorySemesterRepository extends JpaRepository<CategorySemester, Long> {

}
