package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryPublisher;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategoryPublisher entity.
 */
@SuppressWarnings("unused")
public interface CategoryPublisherRepository extends JpaRepository<CategoryPublisher,Long> {

}
