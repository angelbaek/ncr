package com.training.ncr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class VmwareController {

    private final VmControll vmControll;

    @Autowired
    public VmwareController(VmControll vmControll) {
        this.vmControll = vmControll;
    }

//    @GetMapping("/powerOnTestVm")
//    public String powerOnTestVm() {
//        vmControll.powerOnTestVm();
//        return "Powering on the test VM";
//    }
    @GetMapping("/getVmConsoleUrl")
    public String getVmConsoleUrl() {
        String vmName = "CentOS7_ServerTemp2";
        String consoleUrl = vmControll.getVmConsoleUrl(vmName);
        if (consoleUrl != null) {
            System.out.println("VM Console URL: " + consoleUrl);
            return consoleUrl;
        } else {
            return "Test VM not found";
        }
    }
}