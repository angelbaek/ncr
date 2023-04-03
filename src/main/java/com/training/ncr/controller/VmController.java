package com.training.ncr.controller;

import com.training.ncr.service.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
public class VmController {

    @Autowired
    VmService vmService;

    @GetMapping("/get_vm_id")
    public String getVmId(HttpServletRequest request){
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("USERID");
        return vmService.getVmId(userId);
    }
}
