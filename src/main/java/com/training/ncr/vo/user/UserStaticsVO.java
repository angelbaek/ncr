package com.training.ncr.vo.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStaticsVO {
    int num; // 훈련차시
    int type; // 팀별,개인
    int tr_exam_grpid; // if문 조건을 위한 추가
    String id; // if문 조건 추가
    int grp;
}
