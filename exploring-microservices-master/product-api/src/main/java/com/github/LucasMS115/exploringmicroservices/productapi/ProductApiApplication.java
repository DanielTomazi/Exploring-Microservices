package com.github.LucasMS115.exploringmicroservices.productapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication
public class ProductApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProductApiApplication.class, args);

		Logger LOGGER = Logger.getLogger("Main-Logger");
		LOGGER.info("## Application Started! ##");
	}

}
