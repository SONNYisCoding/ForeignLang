package com.foreignlang.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Controller for authentication pages (login, logout)
 */
@Controller
public class AuthController {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/login")
    public RedirectView loginPage() {
        // Redirect login request to Frontend Landing Page (where the "Login with
        // Google" button is)
        return new RedirectView(frontendUrl + "/");
    }
}
