// com.efir.service.ai.AiChatService
package com.efir.service.ai;

/**
 * Handles AI chat completions via external API.
 */
public interface AiChatService {

    /**
     * Sends a chat message to the AI provider and returns the response.
     *
     * @param content the user's message
     * @return the AI-generated response
     */
    String chat(String content);
}
