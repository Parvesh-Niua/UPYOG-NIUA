package org.upyog.Automation.config;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.net.URL;

@Component
public class WebDriverFactory {

    @Value("${selenium.grid.url:http://selenium-chrome:4444}")
    private String gridUrl;

    @Value("${selenium.grid.enabled:false}")
    private boolean gridEnabled;

    public WebDriver createDriver() {
        try {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--remote-allow-origins=*");
            options.addArguments("--disable-blink-features=AutomationControlled");
            options.addArguments("--start-maximized");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");

            if (gridEnabled) {
                return new RemoteWebDriver(new URL(gridUrl), options);
            } else {
                return new ChromeDriver(options);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create WebDriver: " + e.getMessage(), e);
        }
    }
}
