// com.efir.service.ai.AiChatServiceImpl
package com.efir.service.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
class AiChatServiceImpl implements AiChatService {

    private final WebClient webClient;
    private final String model;

    AiChatServiceImpl(
            @Value("${groq.api.url}") String apiUrl,
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.model}") String model) {

        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public String chat(String content) {
        log.info("Sending AI chat request (model={})", model);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", content)
                )
        );

        try {
            String response = webClient.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("AI chat response received");
            return response;
        } catch (Exception e) {
            log.error("AI chat request failed: {}", e.getMessage(), e);
            throw new RuntimeException("AI service unavailable", e);
        }
    }
}
