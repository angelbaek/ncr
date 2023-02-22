/**
 * 문제 풀이 js
 */
// 2차 풀이여부 전역변수
let staticAllowSecans;
// 훈련 시작한 문제 그룹명, 차시 가져오기
var grpnameAndGrpnum = searchMgmtState();
var grpname = "";
grpname = grpnameAndGrpnum["name"];
// count ma
var arrMa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// 훈련차시
var grpnum = 0;
grpnum = grpnameAndGrpnum["num"];
// 문제 그룹 id
var examGrpid = 0;
// 세션 가져오기
sessionManagementForUser();
// 유저 팀코드
getStartExamAndGrp(grpname);
// 훈련자 첫 진입 post
insertUserTrainExamStat();
// 훈련자 첫 팀플 post
insertExamstatTeam();
// 풀이 중인 훈련자 팀 가져오기
clientViewUpdate();
// 훈련진행중인 시간 가져오기
startTrainingGetTime();
// 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
getTotalStatus(staticAllowSecans);
// 제출여부
checkSubmitExam();

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
        alert("훈련이 진행중인 문제그룹이 없습니다.");
        location.href = "/user_group_setting";
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

// let staticSecansDeduct = 0;
// let staticHintDeduct = 0;
// 문제 그룹명으로 문제 불러오기
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
      // staticSecansDeduct = response[0].tr_secans_deduct; // 2차 풀이 감점
      // staticHintDeduct = response[0].tr_hint_deduct; // 힌트 사용 감점
      // 문제id 대입
      examGrpid = response[0].tr_exam_grpid;
      // 실제 총 문항 갯수 대입
      realExamCount = response.length;
      //2차 풀이 여부
      staticAllowSecans;
      staticAllowSecans = response[0].tr_allow_secans;
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
        countMaTactics(response[i].ma_tactics_id);
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
          "<div class='common_num_box' id='box_" +
          response[i].ma_tactics_id +
          "'>" +
          response[i].tr_exam_num +
          "</div>" +
          "<div class='common_contents_only_css'>" +
          response[i].tr_exam_cont +
          "</div>" +
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
                ")'>정답확인</button><button id='hint_btn_" +
                examid +
                "' onclick='getHintFunc(" +
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
                "'>감점여부: 힌트" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button id='hint_btn_not_use' disabled style='background-color: gray;'>힌트</button></div>" +
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
                "'>감점여부: 힌트" +
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
                "' class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button id='hint_btn_" +
                examid +
                "' onclick='getHintFunc(" +
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
                "'>감점여부: 힌트" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button id='ans_btn_" +
                examid +
                "' class='common_ans_btn' onclick='checkAnsBtnMulti(" +
                examid +
                ")'>정답확인</button><button id='hint_btn_not_use' disabled style='background-color: gray;'>힌트</button></div>" +
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
                "'>감점여부: 힌트" +
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
              ")'>정답확인</button><button id='hint_btn_" +
              examid +
              "' onclick='getHintFunc(" +
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
              "'>감점여부: 힌트" +
              "</div></div>";
            // 힌트 미사용
          } else if (response[i].tr_exam_hint_flg == 0) {
            html +=
              "<div class='ans_hint_div'><button id='ans_btn_" +
              examid +
              "' class='common_ans_btn' onclick='checkAnsBtnShort(" +
              examid +
              ")'>정답확인</button><button id='hint_btn_not_use' disabled style='background-color: gray;'>힌트</button></div>" +
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
              "'>감점여부: 힌트" +
              "</div></div>";
          }
        }
        // insert
        insertExamResultAndTeam(response[i].tr_exam_id);
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

// 훈련자별, 훈련팀별 db 첫 진입시 insert
function insertExamResultAndTeam(examId) {
  var jsonData = {
    tr_exam_id: examId,
    tr_num: grpnum,
    tr_exam_grpid: examGrpid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/insert_train_examresult_and_team",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        console.log("첫 상세 db insert");
      } else if (response == 0) {
        console.log("상세 db 존재");
      }
    },
  });
}
// 제출하기 팝업
function submitPopup() {
  $(".submit_popup").toggle();
  $(".back").toggle();
  scrollPause();
}
// 제출하기 팝업 off
function submitPopupOff() {
  $(".submit_popup").toggle();
  $(".back").toggle();
  scrollPlay();
}

// 훈련자 힌트 입력 event
function getHintFunc(grpId, examId, hintDeduct) {
  // 제출여부
  checkSubmitExam();
  // view update
  clientViewUpdate();
  // 힌트 가져오기
  getHint(examId, grpId);
  $(".hint_popup").toggle();
  $(".back").toggle();
  //scroll
  scrollPause();
  var jsonData = {
    // 획득점수에 힌트점수 반영하게
    tr_exam_id: examId,
    result_score: hintDeduct,
    tr_num: grpnum,
    tr_exam_grpid: grpId,
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
        console.log("첫 힌트 사용자");
        $(".show_hint_p_" + examId).text("");
        $(".exam_deduct_status_" + examId).css("display", "block");
      } else if (response == 1) {
        console.log("이미 힌트 사용한 팀");
        $(".show_hint_p_" + examId).text("");
      }
      // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
      getTotalStatus(staticAllowSecans);
      // 제출여부
      checkSubmitExam();
    },
  });
}

// 해당 힌트 가져오기
function getHint(examId, grpId) {
  // 제출 여부
  checkSubmitExam();
  var jsonData = {
    tr_exam_id: examId,
    tr_exam_grpid: grpId,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_hint",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      var html = response[0].tr_exam_hint;
      $(".hint_popup_contents").empty();
      $(".hint_popup_contents").append(html);
      if (response[0].tr_exam_hint_file == 1) {
        console.log("파일 넣기 실행중..");
        $(".file_download_div").empty();
        var fileName = response[0].tr_exam_hint_file_path;
        var html =
          // "<form>" +
          // '<label for="filename">Enter Filename:</label>' +
          // '<input type="text" id="filename" name="filename" value="' +
          // fileName +
          // '">' +
          // '<button type="button" onclick="downloadFile()">Download</button>' +
          // "</form>";

          '<input type="hidden" id="filename" name="filename" value="' +
          fileName +
          '">' +
          '<div class="file_div"><p>File Down: </p><a name="filename" onclick="downloadFile()">' +
          fileName +
          "</a><div>";
        $(".file_download_div").append(html);
      }
    },
  });
}
// 다운로드 구현중
function downloadFile() {
  var filename = $("#filename").val();
  $.ajax({
    url: "http://192.168.32.44:8080/user/download?filename=" + filename,
    method: "GET",
    xhrFields: {
      responseType: "blob",
    },
    success: function (data) {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
}

// 힌트 팝업 토글
function hintPopUp() {
  $(".hint_popup").toggle();
  $(".back").toggle();
  scrollPlay();
}

// 객관식 정답확인 event
function checkAnsBtnMulti(examId) {
  // 제출 여부
  checkSubmitExam();
  // 사용자가 입력한 답 대입할 변수
  let inputAnswer = "";
  // 객관식(복수X) 값 가져오기
  var userCheckMulti = $(
    'input[name="radiofunc_' + examId + '"]:checked'
  ).val();
  console.log(userCheckMulti);
  inputAnswer = userCheckMulti;
  // 객관식(복수정답)
  let = multipleAnswer = "";
  if (userCheckMulti == undefined) {
    console.log("이 문제는 복수정답이다");
    var arrAns = [];
    for (var i = 1; i < 6; i++) {
      var check = $(".mult_ans_input_" + i + "_" + examId).prop("checked");
      // 활성화 된 값 가져오기
      if (check) {
        var ansVal = $(".mult_ans_input_" + i + "_" + examId).val();
        arrAns.push(ansVal);
      }
    }
    console.log(arrAns.length);
    for (var i = 0; i < arrAns.length; i++) {
      if (i == arrAns.length - 1) {
        multipleAnswer += arrAns[i];
      } else {
        multipleAnswer += arrAns[i] + ",";
      }
    }
    // 답안 미선택
    if (multipleAnswer == "") {
      alert("답을 선택하세요");
      return;
    }
    inputAnswer = multipleAnswer;
    console.log("복수정답 잘 나옴?:" + inputAnswer);
  }
  console.log("최종 답안:" + inputAnswer);
  // 객체 넣기 (답안,훈련차시)
  var jsonData = {
    // 훈련자 답안
    input_answer: inputAnswer,
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
    // 문제 id
    tr_exam_id: examId,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/using_answer_multi",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("풀 수 있음!!");
      } else if (response == 0) {
        alert("해당 문제는 더 이상 풀 수 없습니다");
        clientViewUpdate();
        // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
        getTotalStatus(staticAllowSecans);
        return;
      } else if (response == 9) {
        // 정답일때
        alramAns(1);
      } else if (response == 8) {
        $('input[name="radiofunc_' + examId + '"]').prop("checked", false);
        for (var i = 1; i < 6; i++) {
          $(".mult_ans_input_" + i + "_" + examId).prop("checked", false);
        }
        // 오답일때
        alramAns(0);
      } else if (response == 3) {
        alert("server에서 data를 받아 올 수 없습니다.");
      }
      // count
      countAnsExamResultTeam();
      // view update
      clientViewUpdate();
      // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
      getTotalStatus(staticAllowSecans);
      // 제출여부
      checkSubmitExam();
    },
  });
}

// 정답 오답 알림 함수
function alramAns(ans) {
  console.log("알리미 실행중..." + ans);
  if (ans == 1) {
    //정답
    $(".resultTrue").text("정답!");
    $(".resultTrue").css("backgroundColor", "#013adf");
    toggleAlram();
  } else if (ans == 0) {
    //오답
    $(".resultTrue").text("오답!");
    $(".resultTrue").css("backgroundColor", "#df0101");
    toggleAlram();
  }
  setTimeout(function () {
    toggleAlram();
  }, 1500);
}
// 알림 토글
function toggleAlram() {
  $(".resultTrue").toggle();
}

// 주관식 정답확인 event
function checkAnsBtnShort(examId) {
  // 제출 여부
  checkSubmitExam();
  // 사용자가 입력한 답 대입할 변수
  let inputAnswer = $("#short_form_input_ans_" + examId).val();
  console.log(inputAnswer);

  if (inputAnswer == "") {
    alert("답안을 기입하세요");
    $("#short_form_input_ans_" + examId).focus();
    return;
  }
  var jsonData = {
    // 훈련자 답안
    input_answer: inputAnswer,
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
    // 문제 id
    tr_exam_id: examId,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/using_answer_short_form",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("풀 수 있음!!");
      } else if (response == 0) {
        alert("해당 문제는 더 이상 풀 수 없습니다");
        // view update
        clientViewUpdate();
        return;
      } else if (response == 9) {
        // 정답일때
        alramAns(1);
      } else if (response == 8) {
        // 오답일때
        alramAns(0);
      } else if (response == 3) {
        alert("server에서 data를 받아 올 수 없습니다.");
      }
    },
  });
  // count
  countAnsExamResultTeam();
  // view update
  clientViewUpdate();
  // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
  getTotalStatus(staticAllowSecans);
  // 제출여부
  checkSubmitExam();
}

// 풀이 중인 훈련자 팀 가져오기
function clientViewUpdate() {
  $("#ta1").text(arrMa[0]);
  $("#ta2").text(arrMa[1]);
  $("#ta3").text(arrMa[2]);
  $("#ta4").text(arrMa[3]);
  $("#ta5").text(arrMa[4]);
  $("#ta6").text(arrMa[5]);
  $("#ta7").text(arrMa[6]);
  $("#ta8").text(arrMa[7]);
  $("#ta9").text(arrMa[8]);
  $("#ta10").text(arrMa[9]);
  $("#ta11").text(arrMa[10]);
  $("#ta40").text(arrMa[11]);
  $("#ta42").text(arrMa[12]);
  $("#ta43").text(arrMa[13]);
  var jsonData = {
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_exam_result_team",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        var userScore = response[i].result_score; // 획득 점수
        // staticAllowSecans  2차 풀이 여부
        var examId = response[i].tr_exam_id; // 문제 id
        var cntTryAns = response[i].cnt_try_ans; // 정답 입력 횟수
        var hintUse = response[i].hint_use;
        if (staticAllowSecans == 1) {
          // 활성
          if (userScore > 0) {
            // 답을 맞춘상태
            ansBtnOff(examId);
            hintBtnOff(examId);
            // 정답 view
            $(".answer_" + examId).css("display", "block");
            if (cntTryAns == 1) {
              // 1차에서 정답
              // 첫번째 view
              $(".result_exam_explanation_first_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_first_" + examId).text(
                "첫번째: 정답"
              );
              // 정답 view
              $(".answer_" + examId).css("display", "block");
              if (hintUse == 1) {
                // 힌트 사용
                // 힌트 사용 p 태그 공란
                $(".show_hint_p_" + response[i].tr_exam_id).text("");
                // 감점 여부 view
                $(".exam_deduct_status_" + examId).css("display", "block");
                $(".exam_deduct_status_" + examId).text("감점여부: 힌트");
              } else if (hintUse == 0) {
                // 힌트 미사용
              }
            } else if (cntTryAns == 2) {
              // 2차에서 정답
              // 첫번째 view
              $(".result_exam_explanation_first_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_first_" + examId).text(
                "첫번째: 오답"
              );
              // 두번째 view
              $(".result_exam_explanation_second_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_second_" + examId).text(
                "두번째: 정답"
              );
              if (hintUse == 1) {
                // 힌트 사용
                // 힌트 사용 p 태그 공란
                $(".show_hint_p_" + response[i].tr_exam_id).text("");
                // 감점 여부 view
                $(".exam_deduct_status_" + examId).css("display", "block");
                $(".exam_deduct_status_" + examId).text(
                  "감점여부: 힌트, 2차풀이"
                );
              } else if (hintUse == 0) {
                // 힌트 미사용
              }
            }
          } else if (userScore == 0) {
            // 답을 못맞춤
            if (cntTryAns == 1) {
              // 1차에서 오답
              // 첫번째 view
              $(".result_exam_explanation_first_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_first_" + examId).text(
                "첫번째: 오답"
              );
              if (hintUse == 1) {
                // 힌트 사용
                // 힌트 사용 p 태그 공란
                $(".show_hint_p_" + response[i].tr_exam_id).text("");
                // 감점 여부 view
                $(".exam_deduct_status_" + examId).css("display", "block");
                $(".exam_deduct_status_" + examId).text("감점여부: 힌트");
              } else if (hintUse == 0) {
                // 힌트 미사용
              }
            } else if (cntTryAns == 2) {
              ansBtnOff(examId);
              hintBtnOff(examId);
              // 정답 view
              $(".answer_" + examId).css("display", "block");
              // 2차에서 오답
              // 첫번째 view
              $(".result_exam_explanation_first_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_first_" + examId).text(
                "첫번째: 오답"
              );
              // 두번째 view
              $(".result_exam_explanation_second_" + examId).css(
                "display",
                "block"
              );
              $(".result_exam_explanation_second_" + examId).text(
                "두번째: 오답"
              );
              if (hintUse == 1) {
                // 힌트 사용
                // 힌트 사용 p 태그 공란
                $(".show_hint_p_" + response[i].tr_exam_id).text("");
                // 감점 여부 view
                $(".exam_deduct_status_" + examId).css("display", "block");
                $(".exam_deduct_status_" + examId).text(
                  "감점여부: 힌트, 2차풀이"
                );
              } else if (hintUse == 0) {
                // 힌트 미사용
                // 감점 여부 view
                $(".exam_deduct_status_" + examId).css("display", "block");
                $(".exam_deduct_status_" + examId).text("감점여부: 2차풀이");
              }
            }
          }
        } else if (staticAllowSecans == 0) {
          // 비활성
          if (userScore > 0) {
            // 답을 맞춘상태
            ansBtnOff(examId);
            hintBtnOff(examId);
            // 정답 view
            $(".answer_" + examId).css("display", "block");
            // 첫번째 view
            $(".result_exam_explanation_first_" + examId).css(
              "display",
              "block"
            );
            $(".result_exam_explanation_first_" + examId).text("첫번째: 정답");
            // 정답 view
            $(".answer_" + examId).css("display", "block");
            if (hintUse == 1) {
              // 힌트 사용
              // 힌트 사용 p 태그 공란
              $(".show_hint_p_" + response[i].tr_exam_id).text("");
              // 감점 여부 view
              $(".exam_deduct_status_" + examId).css("display", "block");
              $(".exam_deduct_status_" + examId).text("감점여부: 힌트");
            }
          } else if (userScore == 0) {
            // 답을 못맞춤
            // 정답 view
            $(".answer_" + examId).css("display", "block");
            // 첫번째 view
            $(".result_exam_explanation_first_" + examId).css(
              "display",
              "block"
            );
            $(".result_exam_explanation_first_" + examId).text("첫번째: 오답");
            if (hintUse == 1) {
              // 힌트 사용
              // 힌트 사용 p 태그 공란
              $(".show_hint_p_" + response[i].tr_exam_id).text("");
              // 감점 여부 view
              $(".exam_deduct_status_" + examId).css("display", "block");
              $(".exam_deduct_status_" + examId).text("감점여부: 힌트");
            }
          }
        }
      }
    },
  });
}

// 훈련진행중인 시간 가져오기
function startTrainingGetTime() {
  var jsonData = {
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/get_start_training_get_time",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == "") {
        return;
      }
      console.log("결과값:" + response);
      var txt = "";
      txt = response.toString();
      console.log("기본값:" + txt);
      var traingHour = txt.substring(11, 13);
      var traingMin = parseInt(txt.substring(14, 16));
      var traingSec = parseInt(txt.substring(17, 19));

      console.log("h:" + traingHour + "m:" + traingMin + "s:" + traingSec);
      // 현재 시각
      let now = new Date();
      // 날 계산
      var year =
        now.getFullYear() + parseInt(now.getMonth() + 1) + now.getDate(); // 날
      console.log(
        "year:" + year + "day:" + now.getDay() + "date:" + now.getDate()
      );
      console.log("txt:" + txt);
      var target = parseInt(txt.substr(0, 4));
      console.log("첫번째 target:" + target);
      target += parseInt(txt.substring(6, 8));
      console.log("두번째 target:" + target);
      target += parseInt(txt.substring(8, 11));
      console.log("머임 이거:" + txt.substring(8, 11));
      console.log("세첫번째 target:" + target);
      console.log("target:" + target);
      target = target - year; //여기까지
      console.log("날 지낫니?:" + target);
      if (target != 0) {
        time = 0;
        return;
      }
      var hours = now.getHours(); // 현재 시간
      console.log("시간 : ", hours);

      var minutes = now.getMinutes(); // 현재 분
      console.log("분 : ", minutes);

      var seconds = now.getSeconds(); // 현재 초
      console.log("초 : ", seconds);

      var resultHour = (traingHour - hours) * 3600;
      var resultMin = (traingMin - minutes) * 60;
      var resultSec = traingSec - seconds;
      var finalTime = resultHour + resultMin + resultSec;
      console.log(
        "db 시: " + traingHour + " db분: " + traingMin + "db초: " + traingSec
      );
      console.log("현재 분:" + minutes + " db 분:" + traingMin);

      console.log(
        "계산 시:" +
          resultHour +
          " 계산 분:" +
          resultMin +
          " 계산 초:" +
          resultSec
      );

      console.log("최종 초: " + finalTime);
      time += finalTime;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR); //응답 메시지
      console.log(textStatus); //"error"로 고정인듯함
      console.log(errorThrown);
    },
  });
}

// 훈련팀별 풀이 현황정보 정답 수 update
function countAnsExamResultTeam() {
  var jsonData = {
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/user/count_ans_exam_result_team",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log("풀이 개수 :" + response);
    },
  });
}

// 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
function getTotalStatus(staticAllowSecans) {
  if (staticAllowSecans == 1) {
    // 2차 풀이 활성화 일때
    var jsonData = {
      // 훈련 차시
      tr_num: grpnum,
      // 문제 그룹 id
      tr_exam_grpid: examGrpid,
      secansAllow: 1,
    };
    $.ajax({
      url: "http://192.168.32.44:8080/user/get_total_status",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        $(".total_count").text(
          "풀이 개수: " +
            response.explanationcount +
            "/" +
            response.maxexplanationcount
        ); // 풀이 개수 view
        $(".total_score").text("획득점수: " + response.resultscore); // 획득 점수 view
        $(".total_fail_score").text("오답감점: " + response.wrongscore);
        $(".total_hint_deduct").text("힌트감점: " + response.hintscore); // 힌트 감점 view
        if (response.explanationcount == response.maxexplanationcount) {
          // 다 품
          $(".contents").scrollTop($(".contents")[0].scrollHeight);
          $(".back").toggle();
        }
      },
    });
  } else if (staticAllowSecans == 0) {
    // 2차 풀이 비활성화일때
    var jsonData = {
      // 훈련 차시
      tr_num: grpnum,
      // 문제 그룹 id
      tr_exam_grpid: examGrpid,
      secansAllow: 0,
    };
    $.ajax({
      url: "http://192.168.32.44:8080/user/get_total_status",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        $(".total_count").text(
          "풀이 개수: " +
            response.explanationcount +
            "/" +
            response.maxexplanationcount
        ); // 풀이 개수 view
        $(".total_score").text("획득점수: " + response.resultscore); // 획득 점수 view
        $(".total_fail_score").text("오답감점: " + response.wrongscore);
        $(".total_hint_deduct").text("힌트감점: " + response.hintscore); // 힌트 감점 view
        if (response.explanationcount == response.maxexplanationcount) {
          // 다 품
          $(".contents").scrollTop($(".contents")[0].scrollHeight);
          $(".back").toggle();
        }
      },
    });
  }
}

// 제출하기 event
function submitExam() {
  if (
    confirm(
      "정말로 제출 하시겠습니까?\n한번 제출한 문제그룹은 더 이상 해당문제를 풀 수 없습니다."
    )
  ) {
    var jsonData = {
      // 훈련 차시
      tr_num: grpnum,
      // 문제 그룹 id
      tr_exam_grpid: examGrpid,
    };
    console.log(jsonData);
    $.ajax({
      async: false,
      url: "http://192.168.32.44:8080/user/update_submit",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response == 1) {
          alert("문제제출이 완료되었습니다");
          $(".back").css("display", "block");
          $(".submit_popup").toggle();
          scrollPlay();
        } else if (response == 0) {
          alert("다른 훈련자가 이미 제출하였습니다");
          $(".back").css("display", "block");
          $(".submit_popup").toggle();
          scrollPlay();
        }
      },
    });
  }
}

// 제출여부 check
function checkSubmitExam() {
  var jsonData = {
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
  };
  console.log(jsonData);
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/user/check_submit",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 0) {
        alert("해당 문제그룹은 더 이상 문제를 풀 수 없습니다");
        clearInterval(x);
        $(".back").css("display", "block");
      }
    },
  });
}
// ma_tactics_id get
function countMaTactics(ma_tactics_id) {
  if (ma_tactics_id == "TA0001") {
    arrMa[0] += 1;
  } else if (ma_tactics_id == "TA0002") {
    arrMa[1] += 1;
  } else if (ma_tactics_id == "TA0003") {
    arrMa[2] += 1;
  } else if (ma_tactics_id == "TA0004") {
    arrMa[3] += 1;
  } else if (ma_tactics_id == "TA0005") {
    arrMa[4] += 1;
  } else if (ma_tactics_id == "TA0006") {
    arrMa[5] += 1;
  } else if (ma_tactics_id == "TA0007") {
    arrMa[6] += 1;
  } else if (ma_tactics_id == "TA0008") {
    arrMa[7] += 1;
  } else if (ma_tactics_id == "TA0009") {
    arrMa[8] += 1;
  } else if (ma_tactics_id == "TA0010") {
    arrMa[9] += 1;
  } else if (ma_tactics_id == "TA0011") {
    arrMa[10] += 1;
  } else if (ma_tactics_id == "TA0040") {
    arrMa[11] += 1;
  } else if (ma_tactics_id == "TA0042") {
    arrMa[12] += 1;
  } else if (ma_tactics_id == "TA0043") {
    arrMa[13] += 1;
  }
}

function endTimeUpdateTime() {
  var jsonData = {
    // 훈련 차시
    tr_num: grpnum,
    // 문제 그룹 id
    tr_exam_grpid: examGrpid,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/user/end_time_update_time",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        console.log("제한시간이 되어 시간 업데이트...");
      } else if (response == 0) {
        console.log("해당유저는 이미 종료함...");
      }
    },
  });
}

function ansBtnOff(examId) {
  $("#ans_btn_" + examId).prop("disabled", true);
  $("#ans_btn_" + examId).css("backgroundColor", "gray");
  $(".show_hint_p_" + examId).text("");
}
function hintBtnOff(examId) {
  $("#hint_btn_" + examId).prop("disabled", true);
  $("#hint_btn_" + examId).css("backgroundColor", "gray");
}
