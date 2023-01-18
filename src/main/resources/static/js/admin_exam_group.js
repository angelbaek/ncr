/**
 * 관리자 문제그룹 js
 */
// 문제 그룹 불러오기
examGroupCall();

// 문제 그룹 불러오기 함수
function examGroupCall() {
  var html = "";
  $.ajax({
    url: "http://localhost:8080/admin/exam_group",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        html +=
          "<tr class='tr_even'><td>" +
          '<input type="radio" name="double" />' +
          "</td><td>" +
          response[i].tr_exam_grpname +
          "</td><td>" +
          response[i].tr_exam_count +
          "</td></tr>";
      }
      $(".teamcode_view_body").append(html);
    },
  });
}

// 문제 그룹 추가 함수
function grpAdd() {
  $(".exam_add").css("display", "block");
}

// 초기화 함수
function reset() {
  //  문제 그룹명 변수
  $(".grp_name").val("");
  //   문제 개수 변수
  $(".grp_count").val("");
  //   문제 풀이시간 변수
  $(".grp_time").val("");
  // 힌트 사용 허가 변수(참,거짓)
  $(".check_one").prop("checked", false);
  // 힌트 사용 허가 변수(참,거짓)
  $(".check_two").prop("checked", false);
  // 힌트 사용 감점 변수
  $(".input_number1").val("");
  // 두번풀이 사용 감점 변수
  $(".input_number2").val("");
}

// 저장 함수
function save() {
  console.log("save함수 실행된다~~");
  //  문제 그룹명 변수
  var name = $(".grp_name").val();
  //   문제 개수 변수
  var count = $(".grp_count").val();
  //   문제 풀이시간 변수
  var time = $(".grp_time").val();
  // 힌트 사용 허가 변수(참,거짓)
  var hint = $(".check_one").prop("checked");
  if (hint == true) {
    hint = 1;
  } else {
    hint = 0;
  }
  // 힌트 사용 허가 변수(참,거짓)
  var two = $(".check_two").prop("checked");
  if (two == true) {
    two = 1;
  } else {
    two = 0;
  }
  // 힌트 사용 감점 변수
  var num1 = $(".input_number1").val();
  if (num1 == "") {
    num1 = 0;
  }
  // 두번풀이 사용 감점 변수
  var num2 = $(".input_number2").val();
  if (num2 == "") {
    num2 = 0;
  }
  //   조건식 (공란, 잘못된 기입)
  if (name == "") {
    alert("문제 그룹명을 기입하세요");
    $(".grp_name").focus();
    return;
  } else if (count == "") {
    alert("문제 개수를 기입하세요");
    $(".grp_count").focus();
    return;
  } else if (time == "") {
    alert("문제 풀이시간을 기입하세요");
    $(".grp_time").focus();
    return;
  } else if (hint == false && num1 != 0) {
    alert("힌트 사용 허용을 체크하세요");
    $("#focus_one").focus();
    return;
  } else if (two == false && num2 != 0) {
    alert("두번 풀이 허용을 체크하세요");
    return;
  }
}
