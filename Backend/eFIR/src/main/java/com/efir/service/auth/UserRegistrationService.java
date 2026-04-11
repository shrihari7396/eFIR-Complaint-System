// com.efir.service.auth.UserRegistrationService
package com.efir.service.auth;

import com.efir.dto.request.RegisterRequest;
import com.efir.dto.response.UserResponse;

/**
 * Handles user registration concerns only.
 */
public interface UserRegistrationService {

    /**
     * Registers a new user (citizen or police).
     *
     * @param request the registration payload
     * @return the created user response
     */
    UserResponse register(RegisterRequest request);
}
