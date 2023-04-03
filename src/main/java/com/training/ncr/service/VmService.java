package com.training.ncr.service;

import com.training.ncr.mapper.VmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VmService {

    @Autowired
    VmMapper vmMapper;
    public String getVmId(String userId){
        System.out.println(vmMapper.getVmId(userId));
        return vmMapper.getVmId(userId);
    }
}
