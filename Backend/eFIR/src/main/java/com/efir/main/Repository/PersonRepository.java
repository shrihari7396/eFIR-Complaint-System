package com.efir.main.Repository;

import com.efir.main.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {

    @Query("SELECT p FROM Person p WHERE p.firId = :complaintId AND p.personType = 'VICTIM'")
    List<Person> findVictimsByComplaintId(int complaintId);

    @Query("SELECT p FROM Person p WHERE p.firId = :complaintId AND p.personType = 'ACCUSED'")
    List<Person> findAccusedByComplaintId(int complaintId);

    @Query("SELECT p FROM Person p WHERE p.firId = :complaintId AND p.personType = 'WITNESS'")
    List<Person> findWitnessesByComplaintId(int complaintId);


}
