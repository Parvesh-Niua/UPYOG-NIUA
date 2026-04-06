package org.upyog.Automation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.upyog.Automation.Modules.Pet.PetCreateApplication;

@SpringBootApplication
public class TestRunner implements CommandLineRunner {

    @Autowired
    private PetCreateApplication petCreateApplication;

    public static void main(String[] args) {
        SpringApplication.run(TestRunner.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting UPYOG Automation Tests...");
        
//        try {
//            // Run Pet Registration Test
//            petCreateApplication.testingPetApp();
//            System.out.println("Pet Registration test completed successfully!");
//        } catch (Exception e) {
//            System.err.println("Test execution failed: " + e.getMessage());
//            e.printStackTrace();
//        }
        
        System.out.println("All tests completed.");
    }
}