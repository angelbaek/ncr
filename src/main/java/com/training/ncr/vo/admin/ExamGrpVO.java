package com.training.ncr.vo.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamGrpVO {
    // 문제 그룹 id
    int tr_exam_grpid;
    // 문제 그룹명
    String tr_exam_grpname;
    // 문항수
    int tr_exam_count;
    // 힌트 사용 여부
    int tr_hint_use;
    // 힌트 감점
    int tr_hint_deduct;
    // 2차풀이 여부
    int tr_allow_secans;
    // 2차풀이 감점
    int tr_secans_deduct;
    // 풀이시간
    int tr_exam_time;

}
