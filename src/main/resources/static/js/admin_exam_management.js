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
          "<tr><td class='exam_common_css' id='exam_id_" +
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
      }
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
    },
  });
}
