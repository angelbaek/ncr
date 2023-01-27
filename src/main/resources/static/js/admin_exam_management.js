/**
 * 문항 관리 js
 */
examGroupCall();

getSessionUserInfo();

// 문제 초기화 함수
function resetExam() {
  console.log("초기화 실행댐");
  // 문제 내용 해제
  $(".exam_answer_title_const").val("");
  // 객관식 문제 해제
  $(".tr_exam_choice_1").val("");
  $(".tr_exam_choice_2").val("");
  $(".tr_exam_choice_3").val("");
  $(".tr_exam_choice_4").val("");
  $(".tr_exam_choice_5").val("");
  // 정답 해제
  $(".tr_exam_ans").val("");
  // 객관식, 단답형 체크박스 해제
  $("#exam-type1").prop("checked", false);
  $("#exam-type2").prop("checked", false);
  // 난이도 해제
  $("input[name=trio]").prop("checked", false);
  // 복수 정답 해제
  $(".tr_exam_mult_ans").prop("checked", false);
}

// 문제 그룹 불러오기
function examGroupCall() {
  var html = "";
  $.ajax({
    url: "http://localhost:8080/admin/exam_mng_grp",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        html +=
          "<option value=" +
          response[i].tr_exam_grpid +
          ">" +
          response[i].tr_exam_grpname +
          "</option>";
      }
      $(".select_view_body").append(html);
    },
  });
}

// 문제 그룹 select 변경 시 함수
function selectGrpChange() {
  var grpId = $(".select_view_body option:selected").val();
  var txt = $(".select_view_body option:selected").text();
  if (txt == "직접선택") {
    location.reload();
  }
  var html = "";
  $.ajax({
    url: "http://localhost:8080/admin/exam_mng_grp/" + grpId,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      // 추가 edit
      for (var i = 0; i < response[0].tr_exam_count; i++) {
        html +=
          "<tr><td class='exam_common_css' value='" +
          (i + 1) +
          "' id='exam_id_" +
          (i + 1) +
          "' onclick='exam(" +
          (i + 1) +
          ")'>" +
          (i + 1) +
          "" +
          "</td></tr>";
      }
      $(".tr_add").empty();
      $(".tr_add").append(html);
    },
  });
}

// 개별 문제 불러오기
var exam_num;
var target_num = 0;
function exam(exam_num) {
  $("#exam_id_" + target_num).css("backgroundColor", "white");
  $("#exam_id_" + target_num).css("color", "blue");
  $("#exam_id_" + target_num).css(
    "box-shadow",
    "0 0px 0px 0px rgb(0 0 0 / 50%)"
  );
  // 문제 그룹 id 변수
  target_num = exam_num;
  // 팝업에 선택한 문항번호 넣기
  $(".popup_hint").val(target_num);
  var exam_grpid = $("select[name=grp_name] option:selected").val();
  console.log(exam_grpid);
  $("#exam_id_" + exam_num).css("backgroundColor", "#6777ef");
  $("#exam_id_" + exam_num).css("color", "white");
  $("#exam_id_" + exam_num).css("box-shadow", "0 1px 4px 1px rgb(0 0 0 / 50%)");
  var jsonData = {
    tr_exam_grpid: exam_grpid,
    tr_exam_num: exam_num,
  };
  $.ajax({
    url: "http://localhost:8080/admin/exam_call",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response.length == 0) {
        alert("설정되지 않은 문항입니다.");
        // 설정되지 않은 문제 db 추가
        var exam_grp_num = exam_num; // 문제번호
        var exam_grp_id = $("select[name=grp_name] option:selected").val(); //문제 그룹 아이디
        var jsonData = {
          tr_exam_num: exam_grp_num,
          tr_exam_grpid: exam_grp_id,
        };
        $.ajax({
          url: "http://localhost:8080/admin/exam_call_none",
          type: "POST",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(jsonData),
          success: function (response) {
            console.log(response);
            hintAddDB();
          },
        });
      } else {
        // 문제 초기화
        resetExam();
        // 문제 유형
        var tr_exam_type = response[0].tr_exam_type;
        // 문제 내용
        var tr_exam_cont = response[0].tr_exam_cont;
        // 객관식 문제
        var tr_exam_choice_1 = response[0].tr_exam_choice_1;
        var tr_exam_choice_2 = response[0].tr_exam_choice_2;
        var tr_exam_choice_3 = response[0].tr_exam_choice_3;
        var tr_exam_choice_4 = response[0].tr_exam_choice_4;
        var tr_exam_choice_5 = response[0].tr_exam_choice_5;
        // 문제 답
        var tr_exam_ans = response[0].tr_exam_ans;
        // 난이도
        var tr_exam_level = response[0].tr_exam_level;
        // 복수 정답 여부
        var tr_exam_mult_ans = response[0].tr_exam_mult_ans;

        // 문제 내용 대입
        $(".exam_answer_title_const").val(tr_exam_cont);
        // 문제 답 대입
        $(".tr_exam_ans").val(tr_exam_ans);
        // 난이도
        if (tr_exam_level == 1) {
          //상
          $("#tr_exam_level1").prop("checked", true);
        } else if (tr_exam_level == 2) {
          //중
          $("#tr_exam_level2").prop("checked", true);
        } else if (tr_exam_level == 3) {
          //하
          $("#tr_exam_level3").prop("checked", true);
        }
        // 복수 정답
        if (tr_exam_mult_ans == 1) {
          // 유
          $(".tr_exam_mult_ans").prop("checked", true);
        }

        // 문제 유형에 따른 대입(객관식)
        if (tr_exam_type == 1) {
          $("#exam-type1").prop("checked", true);
          choiceOn();
          // 1번
          $(".tr_exam_choice_1").val(tr_exam_choice_1);

          // 2번
          $(".tr_exam_choice_2").val(tr_exam_choice_2);

          // 3번
          $(".tr_exam_choice_3").val(tr_exam_choice_3);

          // 4번
          $(".tr_exam_choice_4").val(tr_exam_choice_4);

          // 5번
          $(".tr_exam_choice_5").val(tr_exam_choice_5);
        } else if (tr_exam_type == 2) {
          //주관식
          $("#exam-type2").prop("checked", true);
          choiceOff();
        }
      }
    },
  });
}

// 힌트 db 추가를 위한 문제 id 가져오기
function hintAddDB() {
  // 문제 그룹id
  var grpId = $(".select_view_body option:selected").val();
  // 선택 문항 번호
  var num = $(".popup_hint").val();
  // 문제 id
  var examId;
  // 힌트 내용
  var hint = $(".hint_input").text();
  // 문제 아이디 찾기
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_num: num,
  };
  $.ajax({
    url: "http://localhost:8080/admin/exam_id_get",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      examId = response[0].tr_exam_id;
      console.log("문제 id 가져오기 완료");
      hintDBinsert(examId);
    },
  });
}

// 실질적인 힌트 db insert
function hintDBinsert(examId) {
  // 문제 그룹id
  var grpId = $(".select_view_body option:selected").val();
  // 힌트 insert
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_id: examId,
  };
  $.ajax({
    url: "http://localhost:8080/admin/hint_insert",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      console.log("힌트db 추가 완료");
    },
  });
}

function popup_hint_popupStatus() {
  var txt = $(".select_view_body option:selected").text();
  if (txt == "직접선택") {
    alert("문제 그룹을 선택하세요");
    $(".select_view_body").focus();
    return;
  }
  $(".back").toggle();
  $(".popup_hint").toggle();
  scrollPause();
}

function popup_exam_popupStatus() {
  var txt = $(".select_view_body option:selected").text();
  if (txt == "직접선택") {
    alert("문제 그룹을 선택하세요");
    $(".select_view_body").focus();
    return;
  }
  $(".back").toggle();
  $(".popup_exam").toggle();
  scrollPause();
}

function popup_mit_popupStatus() {
  var txt = $(".select_view_body option:selected").text();
  if (txt == "직접선택") {
    alert("문제 그룹을 선택하세요");
    $(".select_view_body").focus();
    return;
  }

  $(".back").toggle();
  $(".popup_mit").toggle();
  // 문제 id 가져오기
  var examId = onlyGetExamId();
  console.log("잘 가져왔냐?" + examId);
  scrollPause();
  var html;
  $.ajax({
    url: "http://localhost:8080/admin/get_tactics",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        html +=
          "<option value=" +
          response[i].ma_tactics_id +
          ">" +
          response[i].ma_tactics_name +
          "</option>";
      }
      $(".tactics_select").empty();
      $(".tactics_select").append(html);
    },
  });
}
function popup_mit_popupStatus_cancel() {
  $(".back").toggle();
  $(".popup_mit").toggle();
}

// 힌트 update
function updateHint() {
  // 문제 그룹id
  var grpId = $(".select_view_body option:selected").val();
  // 선택 문항 번호
  var num = $(".popup_hint").val();
  // 문제 id
  var examId;

  // 문제 아이디 찾기
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_num: num,
  };
  $.ajax({
    url: "http://localhost:8080/admin/exam_id_get",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      examId = response[0].tr_exam_id;
      updateHintGo(examId);
    },
  });
}

// 실질적인 hintDB update
function updateHintGo(examId) {
  // 문제 그룹id
  var grpId = $(".select_view_body option:selected").val();
  // 힌트 내용
  var hint = $(".hint_input").val();
  // 힌트 업데이트
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_id: examId,
    tr_exam_hint: hint,
  };
  $.ajax({
    url: "http://localhost:8080/admin/hintUpdate",
    type: "PATCH",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("힌트가 저장되었습니다");
        $(".popup_hint").toggle();
        $(".back").toggle();
      }
    },
  });
}

// 문제 ID만 가져오기
function onlyGetExamId() {
  console.log("문제id 가져오기 실행중...");
  // 문제 그룹id
  var grpId = $(".select_view_body option:selected").val();
  // 선택 문항 번호
  var num = $(".popup_hint").val();
  // 문제 id
  var examId;
  // 문제 아이디 찾기
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_num: num,
  };
  $.ajax({
    async: false,
    url: "http://localhost:8080/admin/only_get_examid",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      examId = response;
      console.log("문제id: " + response);
    },
  });
  return examId;
}

// 전술단계 가져오기
function getTactics() {
  $.ajax({
    url: "http://localhost:8080/admin/get_tactics",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
    },
  });
}

// 전술단계 저장
function tacticsSave() {
  // 매트릭스 id
  var tacId = $(".tactics_select option:selected").val();
  // 문제 id
  var examId = onlyGetExamId();
  // 문제그룹 id
  var grpId = $(".select_view_body option:selected").val();
  // 문항번호
  var examNum = $(".popup_hint").val();
  var jsonData = {
    tr_exam_id: examId,
    tr_exam_grpid: grpId,
    tr_exam_num: examNum,
    ma_tactics_id: tacId,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://localhost:8080/admin/update_tactic",
    type: "PATCH",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("전술단계가 저장되었습니다");
        $(".back").toggle();
        $(".popup_mit").toggle();
      }
    },
  });
}

// 문제 저장
function examFinalSave() {
  // 문제 id
  var examId = onlyGetExamId();
  // 문제그룹 id
  var grpId = $(".select_view_body option:selected").val();
  // 문항번호
  var examNum = $(".popup_hint").val();
  // 문제내용
  var examCont = $(".exam_answer_title_const").val();
  // 문제유형
  var check = $(".common_check:checked").val();
  // 객관식
  var cho1 = $(".tr_exam_choice_1").val();
  var cho2 = $(".tr_exam_choice_2").val();
  var cho3 = $(".tr_exam_choice_3").val();
  var cho4 = $(".tr_exam_choice_4").val();
  var cho5 = $(".tr_exam_choice_5").val();
  // 정답
  var ans = $(".tr_exam_ans").val();
  // 난이도
  var level = $("input[name=trio]:checked").val();
  console.log(level);
  // 복수 정답 허용
  var boolean = $(".tr_exam_mult_ans").prop("checked");
  // 복수 정답 허용에 따른 값 대입
  var mult_ans;
  if (boolean) {
    mult_ans = 1;
  } else {
    mult_ans = 0;
  }
  // 조건식
  if (examCont == "") {
    alert("문제를 기입해주세요");
    $(".exam_answer_title_const").focus();
    return;
  }
  if (check == undefined) {
    alert("문제유형을 선택하세요");
    $(".common_check").focus();
    return;
  }
  if (check == 1) {
    if (cho1 == "") {
      alert("객관식 1번을 기입해주세요");
      $(".tr_exam_choice_1").focus();
      return;
    }
    if (cho2 == "") {
      alert("객관식 2번을 기입해주세요");
      $(".tr_exam_choice_2").focus();
      return;
    }
    if (cho3 == "") {
      alert("객관식 3번을 기입해주세요");
      $(".tr_exam_choice_3").focus();
      return;
    }
    if (cho4 == "") {
      alert("객관식 4번을 기입해주세요");
      $(".tr_exam_choice_4").focus();
      return;
    }
    if (cho5 == "") {
      alert("객관식 5번을 기입해주세요");
      $(".tr_exam_choice_5").focus();
      return;
    }
  }
  if (ans == "") {
    alert("정답을 기입해주세요");
    $(".tr_exam_ans").focus();
    return;
  }
  if (level == undefined) {
    alert("난이도를 선택하세요");
    $("input[name=trio]").focus();
    return;
  }
  // ajax TN_TRAIN_EXAM update
  var jsonData = {
    tr_exam_id: examId,
    tr_exam_grpid: grpId,
    tr_exam_num: examNum,
    tr_exam_cont: examCont,
    tr_exam_choice_1: cho1,
    tr_exam_choice_2: cho2,
    tr_exam_choice_3: cho3,
    tr_exam_choice_4: cho4,
    tr_exam_choice_5: cho5,
    tr_exam_ans: ans,
    tr_exam_level: level,
    tr_exam_mult_ans: mult_ans,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://localhost:8080/admin/exam_final_save",
    type: "PATCH",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
    },
  });
}
