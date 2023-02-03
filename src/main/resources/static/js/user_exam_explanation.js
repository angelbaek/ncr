/**
 * 문제 풀이 js
 */
// 훈련 시작한 문제 그룹명, 차시 가져오기
var grpnameAndGrpnum = searchMgmtState();
var grpname = "";
grpname = grpnameAndGrpnum["name"];
var grpnum = 0;
grpnum = grpnameAndGrpnum["num"];
var examGrpid = 0;
// 세션 가져오기
var userInfo = sessionManagementForUser();
// 유저 팀코드
var userTeamCode = 0;
userTeamCode = userInfo["team_cd"];
// 유저 grp (훈련자 지정 그룹)
var userGrp = 0;
userGrp = userInfo["tr_user_grp"];
getStartExamAndGrp(grpname);
// 훈련자 첫 진입 post
insertUserTrainExamStat();
// 훈련자 첫 팀플 post
insertExamstatTeam();
// 시간 변수
// var time = 0;
// 시간 함수
function timeReturn() {
  return time;
}
// 훈련 시작한 그룹 불러오기
function searchMgmtState() {
  //그룹명
  var name;
  //차시
  var num;
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/exam_explanation",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        alert("훈련 시작한 그룹이 없습니다.");
        return;
      }
      name = response[0].tr_exam_grp;
      num = response[0].tr_num;
    },
  });
  var returnResult = {
    name: name,
    num: num,
  };
  return returnResult;
}
function getStartExamAndGrp(grpname) {
  var name;
  var html = "";
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/exam_explanation_sel/" + grpname,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      // 문제id 대입
      examGrpid = response[0].tr_exam_grpid;
      // 실제 총 문항 갯수 대입
      realExamCount = response.length;
      //2차 풀이 여부
      if (response[0].tr_allow_secans == 1) {
        var examid = response[0].tr_exam_id;
        // 2차 풀이 활성화 일때
        for (var i = examid; i <= examid + response.length; i++) {}
      } else {
        // 2차 풀이 아닌것들은 한 번만 기회 제공
        for (var i = examid; i <= examid + response.length; i++) {}
      }
      time = response[0].tr_exam_time * 60;
      for (var i = 0; i < response.length; i++) {
        // 난이도에 따른 상 중 하 텍스트 구문
        var level = response[i].tr_exam_level;
        var levelTxt = "";
        if (level == 3) {
          levelTxt = "하";
        } else if (level == 2) {
          levelTxt = "중";
        } else if (level == 1) {
          levelTxt = "상";
        }
        // 문제 그룹 id
        var grpid = response[i].tr_exam_grpid;
        // 문제 id
        var examid = response[i].tr_exam_id;
        html +=
          "<div class='common_exam_title'>" +
          response[i].tr_exam_num +
          ". " +
          response[i].tr_exam_cont +
          " <p class='ansTargetStr_" +
          examid +
          "'>(난이도:" +
          levelTxt +
          " 배점:" +
          response[i].tr_exam_point;
        // 복수 정답 가능할때
        if (response[i].tr_exam_mult_ans == 1) {
          html += " 복수정답)</p></div>";
        } else {
          html += ")</p></div>";
        }

        //주관식, 객관식 나누기

        // 객관식
        if (response[i].tr_exam_type == 1) {
          html += "<div class='common_exam_contents'>";

          // 복수정답 단수
          if (response[i].tr_exam_mult_ans == 0) {
            html +=
              '<div><input type="radio" class="mult_ans_input_' +
              examid +
              '" value="1" name="radiofunc_' +
              examid +
              '">' +
              "<div class='user_choice_1_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_1 +
              "</div>" +
              '</div><div><input type="radio" class="mult_ans_input_' +
              examid +
              '" value="2" name="radiofunc_' +
              examid +
              '">' +
              "<div class='user_choice_2_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_2 +
              "</div>" +
              '</div><div><input type="radio" class="mult_ans_input_' +
              examid +
              '" value="3" name="radiofunc_' +
              examid +
              '">' +
              "<div class='user_choice_3_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_3 +
              "</div>" +
              '</div><div><input type="radio" class="mult_ans_input_' +
              examid +
              '" value="4" name="radiofunc_' +
              examid +
              '">' +
              "<div class='user_choice_4_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_4 +
              "</div>" +
              '</div><div><input type="radio" class="mult_ans_input_' +
              examid +
              '" value="5" name="radiofunc_' +
              examid +
              '">' +
              "<div class='user_choice_5_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_5 +
              "</div>" +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p class='show_hint_p_" +
                examid +
                "'>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</p></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
                examid +
                "'>첫번째:" +
                "</div><div class='result_exam_explanation_second_" +
                examid +
                "'>두번째:" +
                "</div><div class='answer_" +
                examid +
                "'>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                examid +
                "'>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
                examid +
                "'>첫번째:" +
                "</div><div class='result_exam_explanation_second_" +
                examid +
                "'>두번째:" +
                "</div><div class='answer_" +
                examid +
                "'>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                examid +
                "'>감점여부:" +
                "</div></div>";
            }

            // 복수정답 복수
          } else if (response[i].tr_exam_mult_ans == 1) {
            html +=
              '<div><input type="checkbox" class="mult_ans_input_1_' +
              examid +
              '" value="1">' +
              "<div class='user_choice_1_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_1 +
              "</div>" +
              '</div><div><input type="checkbox" class="mult_ans_input_2_' +
              examid +
              '" value="2">' +
              "<div class='user_choice_2_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_2 +
              "</div>" +
              '</div><div><input type="checkbox" class="mult_ans_input_3_' +
              examid +
              '" value="3">' +
              "<div class='user_choice_3_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_3 +
              "</div>" +
              '</div><div><input type="checkbox" class="mult_ans_input_4_' +
              examid +
              '" value="4">' +
              "<div class='user_choice_4_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_4 +
              "</div>" +
              '</div><div><input type="checkbox" class="mult_ans_input_5_' +
              examid +
              '" value="5">' +
              "<div class='user_choice_5_" +
              examid +
              "'>" +
              response[i].tr_exam_choice_5 +
              "</div>" +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMultiAns(" +
                examid +
                ")'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p class='show_hint_p_" +
                examid +
                "'>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</p></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
                examid +
                "'>첫번째:" +
                "</div><div class='result_exam_explanation_second_" +
                examid +
                "'>두번째:" +
                "</div><div class='answer_" +
                examid +
                "'>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                examid +
                "'>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMultiAns(" +
                examid +
                ")'>정답확인</button></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
                examid +
                "'>첫번째:" +
                "</div><div class='result_exam_explanation_second_" +
                examid +
                "'>두번째:" +
                "</div><div class='answer_" +
                examid +
                "'>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                examid +
                "'>감점여부:" +
                "</div></div>";
            }
          }

          //주관식
        } else if (response[i].tr_exam_type == 2) {
          html +=
            "<div class='common_exam_contents'><input type='text' class='common_short_form' id='short_form_input_ans_" +
            examid +
            "'>";
          // 힌트 사용
          if (response[i].tr_exam_hint_flg == 1) {
            html +=
              "<div class='ans_hint_div'><button id='ans_btn_" +
              examid +
              "' class='common_ans_btn' onclick='checkAnsBtnShort(" +
              examid +
              ")'>정답확인</button><button onclick='getHintFunc(" +
              grpid +
              "," +
              examid +
              "," +
              response[i].tr_hint_deduct +
              ")'>힌트</button><p class='show_hint_p_" +
              examid +
              "'>힌트 사용 시 " +
              response[i].tr_hint_deduct +
              "점 감점됩니다</p></div>" +
              "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
              examid +
              "'>첫번째:" +
              "</div><div class='result_exam_explanation_second_" +
              examid +
              "'>두번째:" +
              "</div><div class='answer_" +
              examid +
              "'>정답: " +
              response[i].tr_exam_ans +
              "</div><div class='exam_deduct_status_" +
              examid +
              "'>감점여부:" +
              "</div></div>";
            // 힌트 미사용
          } else if (response[i].tr_exam_hint_flg == 0) {
            html +=
              "<div class='ans_hint_div'><button id='ans_btn_" +
              examid +
              "' class='common_ans_btn' onclick='checkAnsBtnShort(" +
              examid +
              ")'>정답확인</button></div>" +
              "</div><div class='common_exam_contents' id='ans_result_div'><div class='result_exam_explanation_first_" +
              examid +
              "'>첫번째:" +
              "</div><div class='result_exam_explanation_second_" +
              examid +
              "'>두번째:" +
              "</div><div class='answer_" +
              examid +
              "'>정답: " +
              response[i].tr_exam_ans +
              "</div><div class='exam_deduct_status_" +
              examid +
              "'>감점여부:" +
              "</div></div>";
          }
        }
      }
      $(".exam_explanation").empty();
      $(".exam_explanation").append(html);
    },
  });
}
// 문제 대입 끝

/**
 * 훈련자 문제풀이 기능 구현
 *
 **/

// 훈련자 첫 진입 훈련자별 풀이 현황 insert
function insertUserTrainExamStat() {
  // 훈련자 아이디,훈련자 지정 그룹, 훈련 차시, 문제 그룹 ID
  var jsonData = {
    tr_user_grp: userGrp,
    tr_num: grpnum,
    tr_exam_grpid: examGrpid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/insert_train_exam_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 0) {
        console.log("훈련자별 풀이 현황 db 이미 존재");
      } else if (response == 1) {
        console.log("훈련자별 풀이 현황 db insert!");
      }
    },
  });
}

// 훈련자 첫 팀별 풀이현황 정보 insert
function insertExamstatTeam() {
  // 훈련자 아이디,훈련자 지정 그룹, 훈련 차시, 문제 그룹 ID
  var jsonData = {
    tr_user_grp: userGrp,
    tr_num: grpnum,
    tr_exam_grpid: examGrpid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/insert_train_exam_team_stat",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 0) {
        console.log("훈련팀별 풀이 현황 db 이미 존재");
      } else if (response == 1) {
        console.log("훈련팀별 풀이 현황 db insert!");
      }
    },
  });
}

// 훈련자 힌트 입력 event
function getHintFunc(grpId, examId, hintDeduct) {
  var jsonData = {
    // 획득점수에 힌트점수 반영하게
    result_score: hintDeduct,
    tr_exam_id: examId,
    tr_num: grpnum,
    tr_exam_grpid: examGrpid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/using_hint",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 0) {
        console.log("");
      } else if (response == 1) {
        console.log("");
      }
    },
  });
}