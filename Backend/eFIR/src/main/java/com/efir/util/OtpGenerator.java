// com.efir.util.OtpGenerator
package com.efir.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Generates a 6-digit numeric OTP.
     */
    public String generateOtp() {
        int otp = 100_000 + RANDOM.nextInt(900_000);
        return String.valueOf(otp);
    }
}
