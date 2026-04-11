// com.efir.service.police.PoliceService
package com.efir.service.police;

import com.efir.dto.response.PagedComplaintsResponse;

/**
 * Handles police-side complaint management.
 */
public interface PoliceService {

    /**
     * Fetches paginated complaints for the police dashboard.
     *
     * @param pageNumber 0-indexed page number
     * @param size       page size
     * @return paged complaints response
     */
    PagedComplaintsResponse getAllComplaints(int pageNumber, int size);

    /**
     * Updates the verdict (status) of a complaint.
     *
     * @param complaintId the complaint ID
     * @param verdict     SUCCEEDED or REJECTED
     */
    void updateVerdict(Long complaintId, String verdict);
}
