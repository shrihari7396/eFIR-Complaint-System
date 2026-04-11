// com.efir.entity.Complaint
package com.efir.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.PROCESSING;

    @Column(length = 1000)
    private String evidenceLink;

    // ---- Victim (embedded) ----
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "firstName", column = @Column(name = "victim_first_name", columnDefinition = "TEXT")),
            @AttributeOverride(name = "lastName", column = @Column(name = "victim_last_name", columnDefinition = "TEXT")),
            @AttributeOverride(name = "phone", column = @Column(name = "victim_phone", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.street", column = @Column(name = "victim_street", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.city", column = @Column(name = "victim_city")),
            @AttributeOverride(name = "address.state", column = @Column(name = "victim_state")),
            @AttributeOverride(name = "address.zip", column = @Column(name = "victim_zip")),
            @AttributeOverride(name = "address.country", column = @Column(name = "victim_country"))
    })
    private Person victim;

    // ---- Accused (embedded) ----
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "firstName", column = @Column(name = "accused_first_name", columnDefinition = "TEXT")),
            @AttributeOverride(name = "lastName", column = @Column(name = "accused_last_name", columnDefinition = "TEXT")),
            @AttributeOverride(name = "phone", column = @Column(name = "accused_phone", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.street", column = @Column(name = "accused_street", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.city", column = @Column(name = "accused_city")),
            @AttributeOverride(name = "address.state", column = @Column(name = "accused_state")),
            @AttributeOverride(name = "address.zip", column = @Column(name = "accused_zip")),
            @AttributeOverride(name = "address.country", column = @Column(name = "accused_country"))
    })
    private Person accused;

    // ---- Incidence (embedded) ----
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "date", column = @Column(name = "inc_date")),
            @AttributeOverride(name = "time", column = @Column(name = "inc_time")),
            @AttributeOverride(name = "description", column = @Column(name = "inc_description", columnDefinition = "TEXT")),
            @AttributeOverride(name = "crimeType", column = @Column(name = "inc_crimetype", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.street", column = @Column(name = "inc_street", columnDefinition = "TEXT")),
            @AttributeOverride(name = "address.city", column = @Column(name = "inc_city")),
            @AttributeOverride(name = "address.state", column = @Column(name = "inc_state")),
            @AttributeOverride(name = "address.zip", column = @Column(name = "inc_zip")),
            @AttributeOverride(name = "address.country", column = @Column(name = "inc_country"))
    })
    private Incidence incidence;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum ComplaintStatus {
        PROCESSING, SUCCEEDED, REJECTED
    }
}
