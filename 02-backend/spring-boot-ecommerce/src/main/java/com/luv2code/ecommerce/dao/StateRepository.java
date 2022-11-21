package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Set;

@RepositoryRestResource(collectionResourceRel = "states", path="states")//manually redefine the API-endpoint and name in the JSON-file
public interface StateRepository extends JpaRepository<State, Integer> {

    Set<State> findByCountryCode(@Param("code") String countryCode);
}
