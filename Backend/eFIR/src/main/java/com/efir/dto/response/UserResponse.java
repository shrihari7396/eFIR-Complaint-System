// com.efir.dto.response.UserResponse
package com.efir.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String aadharNumber;
    private String role;
    private Boolean verified;
    private String street;
    private String city;
    private String state;
    private String zip;
    private String country;
}
