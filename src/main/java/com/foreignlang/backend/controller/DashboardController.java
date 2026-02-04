package com.foreignlang.backend.controller;

import com.foreignlang.backend.entity.Topic;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.repository.TopicRepository;
import com.foreignlang.backend.repository.UserRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final UsageQuotaRepository usageQuotaRepository;
    private final SubscriptionService subscriptionService;

    private static final int FREE_DAILY_LIMIT = 5;

    @GetMapping("/")
    public String landingPage() {
        return "landing";
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal OAuth2User principal, Model model) {
        // Get topics for display
        List<Topic> topics = topicRepository.findAll();
        model.addAttribute("topics", topics);

        // Get real user data from OAuth2
        if (principal != null) {
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");

            model.addAttribute("userName", name != null ? name : "User");
            model.addAttribute("userEmail", email);
            model.addAttribute("userAvatar", picture);

            // Get user from database and their quota/subscription status
            userRepository.findByEmail(email).ifPresent(user -> {
                boolean isPremium = subscriptionService.isPremium(user.getId());
                model.addAttribute("userTier", isPremium ? "PREMIUM" : "FREE");
                model.addAttribute("isPremium", isPremium);

                // Get usage quota
                usageQuotaRepository.findByUserId(user.getId()).ifPresent(quota -> {
                    quota.resetIfNewDay();
                    int used = quota.getDailyRequestsCount();
                    int limit = isPremium ? -1 : FREE_DAILY_LIMIT; // -1 means unlimited
                    model.addAttribute("usageCount", used);
                    model.addAttribute("usageLimit", limit);
                    model.addAttribute("usageRemaining", isPremium ? "Unlimited" : (limit - used));
                });
            });
        } else {
            // Fallback for demo/testing
            model.addAttribute("userName", "Guest");
            model.addAttribute("userEmail", "");
            model.addAttribute("userAvatar", "");
            model.addAttribute("userTier", "FREE");
            model.addAttribute("isPremium", false);
            model.addAttribute("usageCount", 0);
            model.addAttribute("usageLimit", FREE_DAILY_LIMIT);
            model.addAttribute("usageRemaining", FREE_DAILY_LIMIT);
        }

        return "dashboard";
    }
}
