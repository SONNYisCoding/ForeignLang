package com.foreignlang.backend.controller;

import com.foreignlang.backend.service.SubscriptionService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@Slf4j
public class PaymentController {

    private final SubscriptionService subscriptionService;

    public PaymentController(
            SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }


    @Value("${sepay.webhook.token}")
    private String sepayWebhookToken;

    // SePay Webhook DTO
    public record SePayWebhookRequest(
            long id,
            @JsonProperty("gateway") String gateway,
            @JsonProperty("transactionDate") String transactionDate,
            @JsonProperty("accountNumber") String accountNumber,
            @JsonProperty("subAccount") String subAccount,
            @JsonProperty("code") String code, // Order Code / Content
            @JsonProperty("content") String content,
            @JsonProperty("transferType") String transferType,
            @JsonProperty("transferAmount") long transferAmount,
            @JsonProperty("accumulated") long accumulated,
            @JsonProperty("referenceCode") String referenceCode,
            @JsonProperty("description") String description) {
    }

    @PostMapping("/sepay-webhook")
    public ResponseEntity<?> handleSePayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody SePayWebhookRequest request) {

        log.info("Received SePay Webhook: {}", request);

        // 1. Validate SePay Webhook Token
        String expectedToken = "Apikey " + sepayWebhookToken;
        if (authorization == null || !expectedToken.equals(authorization)) {
            log.warn("Invalid SePay Webhook Token. Received: {}", authorization);
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        try {
            // 2. Process the order
            subscriptionService.fulfillOrder(request.content(), request.transferAmount());
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            log.error("Error processing SePay webhook: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
