// com.efir.dto.response.ComplaintResponse
package com.efir.dto.response;

import com.efir.dto.request.ComplaintRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

    private Long id;
    private Long userId;
    private String status;
    private String evidenceLink;
    private ComplaintRequest.PersonDto victim;
    private ComplaintRequest.PersonDto accused;
    private ComplaintRequest.IncidenceDto incidence;
    private String createdAt;
}
