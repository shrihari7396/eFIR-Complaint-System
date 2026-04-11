package com.efir.main.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "filedComplaints")  // Prevents recursion in toString()
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String uniqueUserId;

    private String role;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String otp;
    @OneToMany(mappedBy = "filedBy")
    @JsonIgnore  // Prevents infinite loop in JSON serialization
    private List<Complaint> filedComplaints;
}
