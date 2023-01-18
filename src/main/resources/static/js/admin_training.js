//사용자 정보 가져오기
getSessionUserInfo();
//현재 훈련정보 가져오기
getTraining();
/**
 * 제이쿼리 css 기능함수들
 */
// 훈련 시작 버튼 활성화(클릭됨) 함수 css
function trainingStartBtnOn() {
  $("#training_start").attr("disabled", false);
  $("#training_start").css("backgroundColor", "#6777ef");
  $("#training_start").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}
// 훈련 시작 버튼 비활성화(클릭안됨) 함수 css
function trainingStartBtnOff() {
  $("#training_start").attr("disabled", true);
  $("#training_start").css("backgroundColor", "gray");
}

// 훈련 정지 버튼 활성화(클릭됨) 함수 css
function trainingPauseBtnOn() {
  $("#training_pause").attr("disabled", false);
  $("#training_pause").css("backgroundColor", "#6777ef");
  $("#training_pause").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}
// 훈련 정지 버튼 비활성화(클릭안됨) 함수 css
function trainingPauseBtnOff() {
  $("#training_pause").attr("disabled", true);
  $("#training_pause").css("backgroundColor", "gray");
}

// 확인1 버튼 비활성화 css
function ok1BtnOff() {
  $(".btn_ok1").attr("disabled", true);
  $(".btn_ok1").css("backgroundColor", "gray");
}

// 확인1 버튼 활성화 css
function ok1BtnOn() {
  $(".btn_ok1").attr("disabled", false);
  $(".btn_ok1").css("backgroundColor", "#6777ef");
  $(".btn_ok1").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}

// 확인2 버튼 비활성화 css
function ok2BtnOff() {
  $(".btn_ok2").attr("disabled", true);
  $(".btn_ok2").css("backgroundColor", "gray");
}

// 확인2 버튼 활성화 css
function ok2BtnOn() {
  $(".btn_ok2").attr("disabled", false);
  $(".btn_ok2").css("backgroundColor", "#6777ef");
  $(".btn_ok2").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}

// 수정1 버튼 비활성화 css
function edit1BtnOff() {
  $(".btn_edit1").attr("disabled", true);
  $(".btn_edit1").css("backgroundColor", "gray");
}

// 수정1 버튼 활성화 css
function edit1BtnOn() {
  $(".btn_edit1").attr("disabled", false);
  $(".btn_edit1").css("backgroundColor", "#6777ef");
  $(".btn_edit1").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}

// 확인2 버튼 비활성화 css
function edit2BtnOff() {
  $(".btn_edit2").attr("disabled", true);
  $(".btn_edit2").css("backgroundColor", "gray");
}

// 확인2 버튼 활성화 css
function edit2BtnOn() {
  $(".btn_edit2").attr("disabled", false);
  $(".btn_edit2").css("backgroundColor", "#6777ef");
  $(".btn_edit2").hover(
    function () {
      $(this).css("backgroundColor", "#394eea");
    },
    function () {
      $(this).css("backgroundColor", "#6777ef");
    }
  );
}

/**
 * server와 통신하여 api 가져오는 함수들(dataType:json)
 */
// 사용자 정보 가져오기
function getSessionUserInfo() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://localhost:8080/user",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      $(".userName").empty();
      $(".userName").append(response[0].admin_name);
    },
  });
}
// 훈련관리 정보 가져오기
function getTraining() {
  console.log("세션 읽어오기 실행중...");
  $.ajax({
    url: "http://localhost:8080/admin/mgmt",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      console.log(response.length);
      // 훈련설정 mgr 셋업을 위한 변수
      var html1 = "";
      var html2 = "";
      // 훈련설정 mgr 셋업
      for (var i = 0; i < response.length; i++) {
        if (response[i].tr_num == 1) {
          html1 +=
            "<option value='" +
            response[i].tr_exam_grp +
            "'>" +
            response[i].tr_exam_grp +
            "</option>";
        } else if (response[i].tr_num == 2) {
          html2 +=
            "<option value='" +
            response[i].tr_exam_grp +
            "'>" +
            response[i].tr_exam_grp +
            "</option>";
        }
      }
      console.log(html1);
      $("#selectOne").append(html1);
      $("#selectTwo").append(html2);

      //활성화 되어있는 그룹 view에 뿌려주기
      for (var i = 0; i < response.length; i++) {
        //1차시 활성일때
        if (response[i].tr_exam_grp_act == 1) {
          if (response[i].tr_num == 1) {
            console.log("1차시 설정 되어 있음");
            $("#selectOne").val(response[i].tr_exam_grp).prop("selected", true);
            $("#selectOne").attr("disabled", true);
            trainingPauseBtnOn();
          } else if (response[i].tr_num == 2) {
            console.log("2차시 설정 되어 있음");
            //2차시 활성일떄
            $("#selectTwo").val(response[i].tr_exam_grp).prop("selected", true);
            $("#selectTwo").attr("disabled", true);
            trainingPauseBtnOn();
          }
        }
      }

      // 훈련 시작, 훈련 정지 버튼 비활성화를 위한 count
      var count = 0;
      for (var i = 0; i < response.length; i++) {
        // 훈련이 진행중인지, 멈춰 있는지 체크
        if (response[i].tr_mgmt_state == 2) {
          // 훈련정지 일 때
          edit1BtnOn();
          edit2BtnOn();
          $(".check_one").attr("disabled", false);
          $(".check_two").attr("disabled", false);
          console.log("훈련이 멈춰있음");
          var num = response[i].tr_num;
          var grp = response[i].tr_exam_grp;
          // // 1차시 훈련이 정지일떄
          // if (response[i].tr_num == 1) {
          //   $(".check_two").attr("disabled", true);
          // } else if (response[i].tr_num == 2) {
          //   // 2차시 훈련이 정지일떄
          //   $(".check_one").attr("disabled", true);
          // }
          console.log(num + "차시 " + grp + " 문제 그룹 훈련 중지 상태");
          if (num == 1) {
            $(".check_one").prop("checked", true);
          } else {
            $(".check_two").prop("checked", true);
          }
        } else if (response[i].tr_mgmt_state == 1) {
          console.log("훈련이 진행중...");
          if (response[i].tr_num == 1) {
            $(".check_two").attr("disabled", true);
            edit1BtnOff();
          } else if (response[i].tr_num == 2) {
            $(".check_one").attr("disabled", true);
            edit2BtnOff();
          }
          // 몇 차시가 진행중인지 담을 변수
          var num = response[i].tr_num;
          if (num == 1) {
            $(".check_one").prop("checked", true);
            // 1차 설정 확인 버튼 비활성화
            ok1BtnOff();
            edit2BtnOn();
          } else if (num == 2) {
            $(".check_two").prop("checked", true);
            // 2차 설정 확인 버튼 비활성화
            ok2BtnOff();
            edit1BtnOn();
          }
          // 훈련 시작 버튼 비활성화
          trainingStartBtnOff();
          // 훈련 정지 버튼 활성화
          trainingPauseBtnOn();
          return;
        }

        // 훈련 설정이 되있을때
        if (response[i].tr_exam_grp_act == 1) {
          // 훈련 시작 버튼 활성화
          trainingStartBtnOn();
          // 훈련 정지 버튼 비활성화
          trainingPauseBtnOff();

          //문제그룹 설정 되있을때 view 보여주기
          //1차시 훈련 설정 되있을때
          if (response[i].tr_num == 1) {
            console.log("1차시 활성");
            // $(".check_one").prop("checked", true);
            $("#selectOne").val(response[i].tr_exam_grp).prop("selected", true);
            $("#selectOne").attr("disabled", true);
            // 1차 설정 확인 버튼 비활성화
            ok1BtnOff();
          } else if (response[i].tr_num == 2) {
            console.log("2차시 활성");
            //2차시 훈련 설정 되있을떄
            // $(".check_two").prop("checked", true);
            $("#selectTwo").val(response[i].tr_exam_grp).prop("selected", true);
            $("#selectTwo").attr("disabled", true);
            // 2차 설정 확인 버튼 비활성화
            ok2BtnOff();
          }
          count++;
        }
      }
      if (count == 0) {
        trainingStartBtnOff();
        trainingPauseBtnOff();
      }
    },
  });
}

// 훈련 시작
function trainingStart() {
  // 무슨 차시가 활성화인지 담을 변수
  var one = $(".check_one").is(":checked");
  var two = $(".check_two").is(":checked");
  // 차시 별 문제그룹 담을 변수
  var groupOne = $("#selectOne option:selected").val();
  var groupTwo = $("#selectTwo option:selected").val();
  // 차시별 문제그룹 설정이 되있는지 boolean 변수
  var groupOneBoolean = $("#selectOne").prop("selected");
  var groupTwoBoolean = $("#selectTwo").prop("selected");
  console.log("1차 활성화?: " + groupOneBoolean);
  console.log("2차 활성화?: " + groupTwoBoolean);
  if (
    typeof groupOneBoolean == "undefined" ||
    typeof groupTwoBoolean == "undefined"
  ) {
    alert("훈련 설정이 안된 그룹이 있습니다");
    return;
  }

  console.log("선택 차시:" + one + " 선택 그룹:" + groupOne);
  console.log("선택 차시:" + two + " 선택 그룹:" + groupTwo);
  if (one == false && two == false) {
    alert("훈련 시작할 차시를 설정하세요");
    return;
  }
  // 1차시 훈련 시작
  if (one == true) {
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: groupOne,
    };
    $.ajax({
      url: "http://localhost:8080/admin/trainingStart",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response == 0) {
          alert("설정된 훈련이 없습니다");
          return;
        }
        alert("1차시 훈련(" + groupOne + ")을 시작합니다");
        // 훈련 시작 버튼 비활성화
        trainingStartBtnOff();
        // 훈련 정지 버튼 활성화
        trainingPauseBtnOn();
        location.reload();
      },
    });
  } else if (two == true) {
    //2차시 훈련 시작
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: groupTwo,
    };
    $.ajax({
      url: "http://localhost:8080/admin/trainingStart",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response == 0) {
          alert("설정된 훈련이 없습니다");
          return;
        }
        alert("2차시 훈련(" + groupTwo + ")을 시작합니다");
        // 훈련 시작 버튼 비활성화
        trainingStartBtnOff();
        // 훈련 정지 버튼 활성화
        trainingPauseBtnOn();
        location.reload();
      },
    });
  }
}

// 훈련 설정 차시별 함수
// 몇 번째 차시인지 구분을 위한 변수
var trainingNumbers;
function grpActive(trainingNumbers) {
  // 체크박스 활성화 여부였는데 지금은 안씀
  // var one = $(".check_one").is(":checked");
  // var two = $(".check_two").is(":checked");

  if (trainingNumbers == 1) {
    var one = $("select[name=location1] option:selected").text();
    var two = $("select[name=location2] option:selected").text();
    if (one == "직접 선택") {
      alert("1차시 문제 그룹을 선택하세요");
      return;
    } else if (one == two) {
      alert("동일한 문제 그룹으로 설정 할 수 없습니다");
      return;
    }
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: one,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://localhost:8080/admin/gprAct",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          alert("1차 문제 그룹: " + one);
          $("#selectOne").attr("disabled", true);
          // 1차 설정 확인 버튼 비활성화
          ok1BtnOff();
          // 수정 버튼 활성화
          $(".btn_edit1").attr("disabled", false);
          $(".btn_edit1").css("backgroundColor", "#6777ef");
          // location.reload();
        }
      },
    });
  } else if (trainingNumbers == 2) {
    var one = $("select[name=location1] option:selected").text();
    var two = $("select[name=location2] option:selected").text();
    if (two == "직접 선택") {
      alert("2차시 문제 그룹을 선택하세요");
      return;
    } else if (one == two) {
      alert("동일한 문제 그룹으로 설정 할 수 없습니다");
      return;
    }
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: two,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://localhost:8080/admin/gprAct",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          alert("2차 문제 그룹: " + two);
          $("#selectTwo").attr("disabled", true);
          // 2차 설정 확인 버튼 비활성화
          ok2BtnOff();
          location.reload();
        }
      },
    });
  } else {
    alert("체크박스를 활성화 해주세요");
  }
}

// 훈련 정지
function trainingPause() {
  $.ajax({
    url: "http://localhost:8080/admin/trainingPause",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      console.log(response);
      alert("훈련을 정지합니다");
      // 훈련 정지 버튼 활성화
      trainingPauseBtnOff();
      // 훈련 시작 버튼 비활성화
      trainingStartBtnOn();
      edit1BtnOn();
      edit2BtnOn();
      location.reload();
    },
  });
}

// 그룹 view
function groupView() {
  $(".group_view").css("display", "block");
  $(".group_view_title").css("display", "block");
  $.ajax({
    url: "http://localhost:8080/admin/groupView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      $(".group_view_body").empty();
      for (var i = 0; i < response.length; i++) {
        if (i % 2 == 0) {
          html +=
            "<tr class='tr_even'><td>" +
            response[i].tr_user_name +
            "</td><td>" +
            response[i].tr_user_org +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].tr_user_grp +
            "</td></tr>";
        } else {
          html +=
            "<tr class='tr_odd'><td>" +
            response[i].tr_user_name +
            "</td><td>" +
            response[i].tr_user_org +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].tr_user_grp +
            "</td></tr>";
        }
      }
      $(".group_view_body").append(html);
    },
  });
}

//팀코드 view
function teamcodeView() {
  $(".teamcode_view").css("display", "block");
  $.ajax({
    url: "http://localhost:8080/admin/teamcodeView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      var html = "";
      $(".teamcode_view_body").empty();
      for (var i = 0; i < response.length; i++) {
        if (i % 2 == 0) {
          html +=
            "<tr class='teamcode_tr_even'><td>" +
            response[i].tr_user_grp +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].vm_id +
            "</td></tr>";
        } else {
          html +=
            "<tr class='teamcode_tr_odd'><td>" +
            response[i].tr_user_grp +
            "</td><td>" +
            response[i].team_cd +
            "</td><td>" +
            response[i].vm_id +
            "</td></tr>";
        }
      }
      console.log("추가");
      console.log(html);
      $(".teamcode_view_body").append(html);
    },
  });
}

// 팀코드 뷰 닫기
function teamcode_view_btn() {
  $(".teamcode_view").css("display", "none");
}

// 수정 버튼
var editNum; // 몇 번 버튼인지 확인할 변수
function edit(editNum) {
  console.log("클릭댐");
  // select에 설정된 값
  var one = $("select[name=location1] option:selected").text();
  var two = $("select[name=location2] option:selected").text();
  if (editNum == 1) {
    // 기존 설정값 비활성화 시키기(grp_act)
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: one,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://localhost:8080/admin/gpract_edit",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          ok1BtnOn();
          $("#selectOne").attr("disabled", false);
        }
      },
    });
  } else if (editNum == 2) {
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: two,
    };
    console.log(jsonData);
    $.ajax({
      url: "http://localhost:8080/admin/gpract_edit",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        console.log(response);
        if (response > 0) {
          ok2BtnOn();
          $("#selectTwo").attr("disabled", false);
        }
      },
    });
  }
}
