package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
public class HocPhanController {

    @GetMapping("/api/kiem-tra")
    public String kiemTraKetNoi() {
        return "Đã kết nối thành công với Spring Boot!";
    }
}