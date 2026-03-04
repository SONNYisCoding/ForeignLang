package com.foreignlang.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Controller for authentication pages (login, logout)
 */
@Controller
public class AuthController {

    private final List<String> frontendUrls;

    public AuthController(@Value("${app.frontend.urls}") List<String> frontendUrls) {
        this.frontendUrls = frontendUrls;
    }

    private String getFrontendUrl(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        String origin = request.getHeader("Origin");
        String sourceUrl = origin != null ? origin : (referer != null ? referer : "");
        for (String url : frontendUrls) {
            if (sourceUrl.startsWith(url)) {
                return url;
            }
        }
        return frontendUrls.isEmpty() ? "" : frontendUrls.get(0);
    }

    @GetMapping("/login")
    public RedirectView loginPage(HttpServletRequest request) {
        // Redirect login request to Frontend Landing Page (where the "Login with
        // Google" button is)
        return new RedirectView(getFrontendUrl(request) + "/");
    }
}
