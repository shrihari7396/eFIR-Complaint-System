// com.efir.service.user.UserProfileService
package com.efir.service.user;

import com.efir.dto.response.UserResponse;

/**
 * Handles user profile retrieval concerns.
 */
public interface UserProfileService {

    /**
     * Retrieves the user profile by username.
     *
     * @param username the username extracted from JWT
     * @return the user response
     */
    UserResponse getUserByUsername(String username);
}
