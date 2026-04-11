// com.efir.service.otp.OtpDeliveryStrategy
package com.efir.service.otp;

/**
 * Strategy interface for OTP delivery channels.
 * Implementations: email (now), SMS (future).
 */
public interface OtpDeliveryStrategy {

    /**
     * Delivers the OTP to the specified recipient.
     *
     * @param recipient the email or phone number
     * @param otpCode   the 6-digit OTP
     */
    void deliver(String recipient, String otpCode);
}
