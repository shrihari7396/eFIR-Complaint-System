// com.efir.config.MailConfig
package com.efir.config;

import org.springframework.context.annotation.Configuration;

/**
 * Mail configuration.
 * <p>
 * Spring Boot auto-configures {@link org.springframework.mail.javamail.JavaMailSender}
 * from {@code spring.mail.*} properties. This class exists as an explicit
 * configuration entry point for future customisation (e.g. template engines).
 * </p>
 */
@Configuration
public class MailConfig {
    // Auto-configured by Spring Boot via spring.mail.* properties
}
