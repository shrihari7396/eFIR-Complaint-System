package com.efir.main.model.complaintdata;

import com.efir.main.model.User;
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
public class ComplaintStatus {

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "status_updated_by", nullable = true)
    private User user;



    private String status = "Pending";

    private String remark;
}


