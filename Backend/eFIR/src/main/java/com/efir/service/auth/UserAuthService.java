// com.efir.service.auth.UserAuthService
package com.efir.service.auth;

import com.efir.dto.request.LoginRequest;

/**
 * Handles authentication concerns only.
 */
public interface UserAuthService {

    /**
     * Authenticates a citizen user and returns a JWT.
     *
     * @param request login payload
     * @return JWT token as plain string
     */
    String loginCitizen(LoginRequest request);

    /**
     * Authenticates a police user and returns a JWT.
     *
     * @param request login payload
     * @return JWT token as plain string
     */
    String loginPolice(LoginRequest request);
}
