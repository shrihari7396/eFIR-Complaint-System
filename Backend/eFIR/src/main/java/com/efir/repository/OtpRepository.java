// com.efir.repository.OtpRepository
package com.efir.repository;

import com.efir.entity.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {

    Optional<OtpRecord> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);

    void deleteAllByExpiresAtBeforeOrUsedTrue(LocalDateTime now);
}
