// com.efir.entity.Person
package com.efir.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {

    @Column(columnDefinition = "TEXT")
    private String firstName;

    @Column(columnDefinition = "TEXT")
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String phone;

    @Embedded
    private Address address;
}
