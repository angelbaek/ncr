package com.training.ncr.vo;

import lombok.Getter;
import lombok.Setter;

/**
 * admin 계정을 위한 vo
 */
@Getter
@Setter
public class AdminVO {

    String admin_id;
    String admin_passwd;
    String admin_name;
    int role;
}
