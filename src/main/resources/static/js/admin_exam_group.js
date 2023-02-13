/**
 * 관리자 문제그룹 js
 */
// 문제 그룹 불러오기
examGroupCall();

getSessionUserInfo();

// 문제 그룹 불러오기 함수
function examGroupCall() {
  var html = "";
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_group",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        html +=
          "<tr class='tr_even'><td>" +
          '<input value="check(' +
          i +
          ')" type="radio" name="double" onclick="radioBtnOn(' +
          response[i].tr_exam_grpid +
          ')"/>' +
          "</td><td class=grp_" +
          i +
          ">" +
          response[i].tr_exam_grpname +
          "</td><td class=" +
          i +
          ">" +
          response[i].tr_exam_count +
          "</td></tr>";
      }
      $(".teamcode_view_body").append(html);
    },
  });
}

// 문제 그룹 추가 함수
function grpAdd() {
  // 속성 부여
  $("#save_toggle_update").removeAttr("onclick");
  $("#save_toggle_update").attr("onclick", "save()");
  $("#save_toggle_update").text("저장");
  $("input[name=double]").prop("checked", false);
  reset();
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
// 문제 그룹명 변수
var grpName;
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
  // 두번 풀이 허가 변수(참,거짓)
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
  // 조건식 통과 후 서버 요청
  var jsonData = {
    tr_exam_grpname: name,
    tr_exam_count: count,
    tr_hint_use: hint,
    tr_hint_deduct: num1,
    tr_allow_secans: two,
    tr_secans_deduct: num2,
    tr_exam_time: time,
  };
  console.log(jsonData);
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/add_exam_grp",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("문제 그룹이 추가되었습니다.");
        grpName = name;
        // 문제그룹명으로 찾은 grpId, 문항수 변수대입
        var grpIdAndCount = findByGrpid();
        var grpId = grpIdAndCount["grpid"];
        var grpCount = grpIdAndCount["count"];
        console.log("찾은것:" + grpIdAndCount["grpid"]);
        console.log("찾은것:" + grpIdAndCount["count"]);
        insertTrainExam(grpId, grpCount);
        // location.reload();
      } else if (response == 0) {
        alert("문제 그룹명이 중복됩니다.");
      }
    },
  });
}
// EXAM 테이블에 insert하기
function insertTrainExam(grpId, grpCount) {
  // var grpid = grpId["grpid"];
  // var count = grpId["count"];
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_count: grpCount,
  };
  console.log(jsonData);
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/add_train_exam",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        var examId = response[i].tr_exam_id;
        insertExamhintByGrpIdAndExamId(grpId, examId);
      }
    },
  });
}

// GrpId, ExamId로 ExamHint insert
function insertExamhintByGrpIdAndExamId(grpId, examId) {
  var jsonData = {
    tr_exam_grpid: grpId,
    tr_exam_id: examId,
  };
  console.log(jsonData);
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/add_train_examhint",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
    },
  });
}

// 그룹명으로 grpid, count 찾기
function findByGrpid() {
  var resultData;
  const map = {};
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/exam_group_find_grpid/" + grpName,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      map["grpid"] = response[0].tr_exam_grpid;
      map["count"] = response[0].tr_exam_count;
    },
  });
  return map;
}

// 삭제 함수
function grpDelete() {
  var check = $("input:radio[name=double]:checked").val();
  console.log(check);
  var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 선택하는 정규식
  var result = check.replace(regex, ""); // 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
  console.log(result); // 결과 출력
  var grpname = "grp_" + result;
  // console.log(grpname);
  var name = $("." + grpname).text();
  // console.log(test);
  if (confirm("정말로 삭제하시겠습니까?")) {
    $.ajax({
      url: "http://192.168.32.44:8080/admin/exam_group_delete/" + name,
      type: "DELETE",
      dataType: "json",
      success: function (response) {
        if (response > 0) {
          alert("삭제 되었습니다");
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR); //응답 메시지
        console.log(textStatus); //"error"로 고정인듯함
        console.log(errorThrown);
        alert("해당 문제그룹에 설정된 문항이 유효합니다");
      },
    });
  }
}

// 선택한 그룹 뿌려주기
function radioBtnOn(num) {
  // 속성 부여
  $("#save_toggle_update").removeAttr("onclick");
  $("#save_toggle_update").attr("onclick", "update()");
  $("#save_toggle_update").text("수정");
  $(".exam_add").css("display", "block");
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_group_select/" + num,
    type: "GET",
    dataType: "json",
    success: function (response) {
      reset();
      console.log(response);
      //문제 그룹명
      $(".grp_name").val(response[0].tr_exam_grpname);
      //문제 개수
      $(".grp_count").val(response[0].tr_exam_count);
      //풀이 시간
      $(".grp_time").val(response[0].tr_exam_time);
      //힌트 허용
      if (response[0].tr_hint_use == 1) {
        $(".check_one").prop("checked", true);
        //힌트 감점
        $(".input_number1").val(response[0].tr_hint_deduct);
      }
      if (response[0].tr_allow_secans == 1) {
        //두번 허용
        $(".check_two").prop("checked", true);
        //두번 감점
        $(".input_number2").val(response[0].tr_secans_deduct);
      }
    },
  });
}
// 문제 그룹 수정
function update() {
  let grpName = $(".grp_name").val();
  let grpCount = $(".grp_count").val();
  let grpTime = $(".grp_time").val();
  let one = $(".check_one").prop("checked");
  let hintDeduct = $(".input_number1").val();
  let two = $(".check_two").prop("checked");
  let secanseDeduct = $(".input_number2").val();
  //조건식
  if (grpName == "") {
    alert("그룹명을 입력하세요");
    $(".grp_name").focus();
    return;
  } else if (grpCount == "") {
    alert("문제 개수를 입력하세요");
    $(".grp_count").focus();
    return;
  } else if (grpTime == "") {
    alert("풀이시간을 입력하세요");
    $(".grp_time").focus();
    return;
  }
  // 필수입력 끝
  if (one == false && hintDeduct != "") {
    alert("힌트사용을 체크하세요");
    $(".check_one").focus();
    return;
  } else if (one == true && hintDeduct == "") {
    alert("힌트감점을 입력하세요");
    $(".input_number1").focus();
    return;
  }
  if (two == false && secanseDeduct != "") {
    alert("두번풀이 허용을 체크하세요");
    $(".check_two").focus();
    return;
  } else if (two == true && secanseDeduct == "") {
    alert("두번풀이 감점을 입력하세요");
    $(".input_number2").focus();
    return;
  }
  // 타입 지정
  // 힌트 사용 허가 변수(참,거짓)
  if (one == true) {
    one = 1;
  } else {
    one = 0;
  }
  // 두번 풀이 허가 변수(참,거짓)
  if (two == true) {
    two = 1;
  } else {
    two = 0;
  }
  // 힌트 사용 감점 변수
  if (hintDeduct == "") {
    hintDeduct = 0;
  }
  // 두번풀이 사용 감점 변수
  if (secanseDeduct == "") {
    secanseDeduct = 0;
  }
  var jsonData = {
    tr_exam_grpname: grpName,
    tr_exam_count: grpCount,
    tr_hint_use: one,
    tr_hint_deduct: hintDeduct,
    tr_allow_secans: two,
    tr_secans_deduct: secanseDeduct,
    tr_exam_time: grpTime,
  };
  console.log(jsonData);
  $.ajax({
    url: "http://192.168.32.44:8080/admin/update_grp_by_grpname",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      if (response == 1) {
        alert("문제그룹이 수정되었습니다.");
      }
    },
  });
}
