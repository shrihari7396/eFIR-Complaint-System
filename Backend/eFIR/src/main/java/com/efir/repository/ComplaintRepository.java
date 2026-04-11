// com.efir.repository.ComplaintRepository
package com.efir.repository;

import com.efir.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findAllByUserId(Long userId);

    Page<Complaint> findAll(Pageable pageable);
}
