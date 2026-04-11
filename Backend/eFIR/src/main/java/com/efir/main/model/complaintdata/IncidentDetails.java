package com.efir.main.model.complaintdata;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Embeddable
public class IncidentDetails {
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeDateOfIncident;
    private String landmark;
    private String district;
    private String subDistrict;
    @Lob
    private String incidentDescription;
}


