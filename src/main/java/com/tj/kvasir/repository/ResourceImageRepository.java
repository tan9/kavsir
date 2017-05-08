package com.tj.kvasir.repository;

import com.tj.kvasir.domain.ResourceImage;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the ResourceImage entity.
 */
@SuppressWarnings("unused")
public interface ResourceImageRepository extends JpaRepository<ResourceImage,Long> {

}
