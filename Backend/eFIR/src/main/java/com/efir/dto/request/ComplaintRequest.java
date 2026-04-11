// com.efir.dto.request.ComplaintRequest
package com.efir.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintRequest {

    private String evidenceLink;
    private PersonDto victim;
    private PersonDto accused;
    private IncidenceDto incidence;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonDto {
        private String firstName;
        private String lastName;
        private String phone;
        private AddressDto address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class IncidenceDto {
        private String date;
        private String time;
        private String description;
        private String crimeType;
        private AddressDto address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDto {
        private String street;
        private String city;
        private String state;
        private String zip;
        private String country;
    }
}
