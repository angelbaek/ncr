/**
 * 문제 풀이 js
 */
// 훈련 시작한 문제 그룹명
var grpName = searchMgmtState();
console.log("훈련 시작 그룹명:" + grpName);
getStartExamAndGrp(grpName);
// 시간 변수
// var time = 0;
// 시간 함수
function timeReturn() {
  return time;
}
// 훈련 시작한 그룹 불러오기
function searchMgmtState() {
  var name;
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
    },
  });
  return name;
}
// 2차 풀이 여부에 따른 변수대입
var arrSecans = {};
// 전역 변수로 2차 변수 대입
var allowSecan;
function getStartExamAndGrp(grpName) {
  var name;
  var html = "";
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_explanation_sel/" + grpName,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      // 실제 총 문항 갯수 대입
      realExamCount = response.length;
      //2차 풀이 여부
      if (response[0].tr_allow_secans == 1) {
        var examid = response[0].tr_exam_id;
        // 2차 풀이 활성화 일때 정답 횟수 2번 대입
        for (var i = examid; i <= examid + response.length; i++) {
          arrCheckCount[i] = false;
          arrSecans[i] = 2;
          allowSecan = true;
        }
      } else {
        // 2차 풀이 아닌것들은 한 번만 기회 제공
        for (var i = examid; i <= examid + response.length; i++) {
          arrCheckCount[i] = false;
          arrSecans[i] = 1;
          allowSecan = false;
        }
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
          response[i].tr_exam_point +
          ")</p></div>";

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
                "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p>힌트 사용 시 " +
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
                "</div><div>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnMulti(" +
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
                "</div><div>감점여부:" +
                "</div></div>";
            }

            // 복수정답 복수
          } else if (response[i].tr_exam_mult_ans == 1) {
            html +=
              '<div><input type="checkbox" class="mult_ans_input_' +
              examid +
              '" value="1">' +
              response[i].tr_exam_choice_1 +
              '</div><div><input type="checkbox" class="mult_ans_input_' +
              examid +
              '" value="2">' +
              response[i].tr_exam_choice_2 +
              '</div><div><input type="checkbox" class="mult_ans_input_' +
              examid +
              '" value="3">' +
              response[i].tr_exam_choice_3 +
              '</div><div><input type="checkbox" class="mult_ans_input_' +
              examid +
              '" value="4">' +
              response[i].tr_exam_choice_4 +
              '</div><div><input type="checkbox" class="mult_ans_input_' +
              examid +
              '" value="5">' +
              response[i].tr_exam_choice_5 +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p>힌트 사용 시 " +
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
                "</div><div>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnMulti(" +
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
                "</div><div>감점여부:" +
                "</div></div>";
            }
          }

          //주관식
        } else if (response[i].tr_exam_type == 2) {
          html +=
            "<div class='common_exam_contents'><input type='text' class='common_short_form'>";
          // 힌트 사용
          if (response[i].tr_exam_hint_flg == 1) {
            html +=
              "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnShort(" +
              examid +
              ")'>정답확인</button><button onclick='getHintFunc(" +
              grpid +
              "," +
              examid +
              "," +
              response[i].tr_hint_deduct +
              ")'>힌트</button><p>힌트 사용 시 " +
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
              "</div><div>감점여부:" +
              "</div></div>";
            // 힌트 미사용
          } else if (response[i].tr_exam_hint_flg == 0) {
            html +=
              "<div class='ans_hint_div'><button class='common_ans_btn' onclick='checkAnsBtnShort(" +
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
              "</div><div>감점여부:" +
              "</div></div>";
          }
        }
      }
      $(".exam_explanation").empty();
      $(".exam_explanation").append(html);
    },
  });
}
// 힌트사용한 변수
var arrHintUsed = {};
// 힌트감점 변수
var hintDeduct = 0;
// 오답점수
var failedAns = 0;
// 정답점수
var successAns = 0;
// 개별문항 감점
var arrTotalDeduct = {};
// 개별풀이 count를 위한 변수
var arrCheckCount = {};
function getHintFunc(grpid, examid, deduct) {
  console.log("힌트 함수: " + grpid + ", " + examid);
  var jsonData = {
    tr_exam_grpid: grpid,
    tr_exam_id: examid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_hint_get",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (arrSecans[examid] == 0) {
        alert(response[0].tr_exam_hint);
        return;
      }
      alert(response[0].tr_exam_hint);
      // 첫 힌트
      if (arrHintUsed[examid] != true) {
        hintDeduct += deduct;
        $(".total_hint_deduct").text("힌트감점: " + hintDeduct + "점");
        // 점수 대입
        if (isNaN(arrTotalDeduct[examid])) {
          arrTotalDeduct[examid] = deduct;
          $(".exam_deduct_status_" + examid).text(
            arrTotalDeduct[examid] + "점 감점되었습니다."
          );
        } else {
          arrTotalDeduct[examid] += deduct;
          $(".exam_deduct_status_" + examid).text(
            arrTotalDeduct[examid] + "점 감점되었습니다."
          );
        }
      }
      // 힌트 사용한 흔적 대입
      arrHintUsed[examid] = true;
    },
  });
}
// 실제 총 문항갯수
var realExamCount = 0;
// 현재까지 푼 갯수
var totalExamCount = 0;
// 객관식 답안 처리
function checkAnsBtnMulti(examId) {
  console.log(examId + "가 정답확인 중");
  // 유저가 체크한 답
  var userAns = $('input[name="radiofunc_' + examId + '"]:checked').val();
  // 유저가 체크한 답의 내용
  var test = userAns + "_" + examId;
  console.log(test);
  var userChoiceTxt = $(".user_choice_" + userAns + "_" + examId).text();
  console.log("선택한 답의 내용: " + userChoiceTxt);
  console.log("선택한 답: " + userAns);
  // 정규식 숫자만 추출
  var targetStr = $(".answer_" + examId).text();
  var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
  var resultAns = targetStr.replace(regex, ""); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
  if (userAns == undefined) {
    alert("답을 선택하세요");
    return;
  }
  if (arrSecans[examId] == 0) {
    alert("해당 문제는 더이상 풀 수 없습니다.");
    return;
  }
  // 2차 풀이 활성화
  if (allowSecan == true) {
    if (arrSecans[examId] == 2) {
      //첫 풀이
      $(".result_exam_explanation_first_" + examId).text(
        "첫번째 선택 답: " + userChoiceTxt
      );
      $(".result_exam_explanation_first_" + examId).css("display", "block");
      //첫 풀이에 바로 맞춤
      if (userAns == resultAns) {
        $(".answer_" + examId).css("display", "block");
      }
    } else if (arrSecans[examId] == 1) {
      //2차 풀이
      $(".result_exam_explanation_second_" + examId).text(
        "두번째 선택 답: " + userChoiceTxt
      );
      $(".result_exam_explanation_second_" + examId).css("display", "block");
      $(".answer_" + examId).css("display", "block");
    }
  } else if (allowSecan == false) {
    //비활성화
  }
  if (arrCheckCount[examId] == false) {
    console.log("풀이 갯수 누적중...");
    arrCheckCount[examId] = true;
    totalExamCount++;
    $(".total_count").text(
      "풀이 개수 :" + totalExamCount + "/" + realExamCount + "개 "
    );
    console.log(totalExamCount);
  }

  if (userAns != resultAns) {
    // 오답 점수 대입
    failedAns += 10;
    alert("오답!");
    if (isNaN(arrTotalDeduct[examId])) {
      arrTotalDeduct[examId] = 10;
      arrSecans[examId]--;
      $(".exam_deduct_status_" + examId).text(
        arrTotalDeduct[examId] + "점 감점되었습니다."
      );
      // 오답 점수 view 대입
      $(".total_fail_score").text("오답점수: " + failedAns + "점");
    } else {
      arrTotalDeduct[examId] += 10;
      arrSecans[examId]--;
      $(".exam_deduct_status_" + examId).text(
        arrTotalDeduct[examId] + "점 감점되었습니다."
      );
      // 오답 점수 view 대입
      $(".total_fail_score").text("오답점수: " + failedAns + "점");
    }
  } else {
    alert("정답!");
    var targetTxt = $(".ansTargetStr_" + examId).text();
    var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
    var scr = parseInt(targetTxt.replace(regex, "")); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
    successAns += scr;
    // 더 이상 못 풀게 대입
    arrSecans[examId] = 0;
    $(".total_score").text("정답점수: " + successAns + "점 ");
  }
}
// 주관식 답안 처리
function checkAnsBtnShort(examId) {}
