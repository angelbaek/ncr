package com.training.ncr.service;

import com.training.ncr.mapper.JoinMapper;
import com.training.ncr.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class JoinService {

    @Autowired
    JoinMapper joinMapper;

    public int callJoin(UserVO userVO){
        String tr_user_id = userVO.getTr_user_id();
        System.out.println(tr_user_id);
        if(joinMapper.userCheck(tr_user_id)!=null){
            System.out.println("계정생성 시도 :"+tr_user_id+"값이 이미 있음");
            return 0;
        }else {
            System.out.println("계정생성 시도 :"+tr_user_id+"값이 없음 계정 생성함");
            return joinMapper.join(userVO);
        }
    }
}
