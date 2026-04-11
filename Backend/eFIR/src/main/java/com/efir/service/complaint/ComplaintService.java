// com.efir.service.complaint.ComplaintService
package com.efir.service.complaint;

import com.efir.dto.request.ComplaintRequest;
import com.efir.dto.response.ComplaintResponse;

import java.util.List;

/**
 * Handles citizen complaint filing and retrieval.
 */
public interface ComplaintService {

    /**
     * Files a new complaint for the given user.
     *
     * @param username the authenticated user's username
     * @param request  the complaint payload
     * @return the saved complaint response
     */
    ComplaintResponse fileComplaint(String username, ComplaintRequest request);

    /**
     * Fetches all complaints filed by the given user.
     *
     * @param username the authenticated user's username
     * @return list of complaint responses
     */
    List<ComplaintResponse> getComplaintsByUser(String username);
}
