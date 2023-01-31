package com.training.ncr.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NowExamVO {
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
    int tr_exam_id, tr_exam_num, tr_exam_type, tr_exam_point, tr_exam_level, tr_exam_mult_ans, tr_exam_hint_flg, ma_matrix_id;

    String tr_exam_cont, tr_exam_choice_1, tr_exam_choice_2, tr_exam_choice_3, tr_exam_choice_4, tr_exam_choice_5, tr_exam_ans, ma_tactics_id;
}
