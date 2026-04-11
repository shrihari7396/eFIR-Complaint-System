// com.efir.controller.AiController
package com.efir.controller;

import com.efir.dto.request.AiChatRequest;
import com.efir.service.ai.AiChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/api")
@RequiredArgsConstructor
public class AiController {

    private final AiChatService aiChatService;

    // ========================= 11. POST /ai/api/groq =========================

    @PostMapping(value = "/groq", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> chat(@Valid @RequestBody AiChatRequest request) {
        String response = aiChatService.chat(request.getContent());
        return ResponseEntity.ok(response);
    }
}
