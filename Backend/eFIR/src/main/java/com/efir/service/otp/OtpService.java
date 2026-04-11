// com.efir.service.otp.OtpService
package com.efir.service.otp;

/**
 * OTP management service — generation, validation, cleanup.
 */
public interface OtpService {

    /**
     * Generates and sends an OTP to the given email.
     *
     * @param email recipient email address
     */
    void generateAndSendOtp(String email);

    /**
     * Verifies the given OTP for the email.
     *
     * @param email the email
     * @param otp   the OTP code
     * @return the JWT token upon successful verification
     */
    String verifyOtp(String email, String otp);
}
