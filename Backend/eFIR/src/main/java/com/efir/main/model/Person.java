package com.efir.main.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "person")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) // Ensure this is NOT null
    private String firId;

    private String name;
    private String address;
    private int age;
    private String aadhar;
    private String contact;
    private String occupation;
    private String personType;
// VICTIM, ACCUSED, or WITNESS
}
