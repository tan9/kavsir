package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategorySubject;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategorySubject entity.
 */
@SuppressWarnings("unused")
public interface CategorySubjectRepository extends JpaRepository<CategorySubject,Long> {

}
