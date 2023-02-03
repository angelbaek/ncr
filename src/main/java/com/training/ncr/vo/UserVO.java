package com.training.ncr.vo;

import lombok.Getter;
import lombok.Setter;

/**
 * user, admin 계정 취합 정보
 */
@Getter
@Setter
public class UserVO {
    // user 정보
    public static String session;
    String tr_user_id;
    String tr_user_passwd;
    String tr_user_org;
    int tr_user_grp;
    String team_cd;
    int role;
    int tr_user_state;
    String tr_user_name;
}
