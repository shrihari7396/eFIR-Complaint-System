// com.efir.dto.response.PagedComplaintsResponse
package com.efir.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedComplaintsResponse {

    private List<ComplaintResponse> complaints;
    private long total;
}
