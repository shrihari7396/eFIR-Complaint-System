// com.efir.entity.Address
package com.efir.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Column(columnDefinition = "TEXT")
    private String street;

    private String city;

    private String state;

    private String zip;

    private String country;
}
