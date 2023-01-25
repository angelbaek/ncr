package com.training.ncr.vo.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamVO {

    int tr_exam_id, tr_exam_grpid, tr_exam_num, tr_exam_type, tr_exam_point, tr_exam_level, tr_exam_mult_ans, tr_exam_hint_flg, ma_matrix_id;

    String tr_exam_cont, tr_exam_choice_1, tr_exam_choice_2, tr_exam_choice_3, tr_exam_choice_4, tr_exam_choice_5, tr_exam_ans, ma_tactics_id;

}
