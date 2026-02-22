package com.foreignlang.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/")
    public RedirectView landingPage() {
        // Redirect root request to Frontend
        return new RedirectView(frontendUrl + "/");
    }
}
