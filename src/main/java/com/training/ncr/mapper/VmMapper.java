package com.training.ncr.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VmMapper {

//    VMID 찾기
    String getVmId(String userId);
}
