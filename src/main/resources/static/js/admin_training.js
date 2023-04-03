//현재 훈련정보 가져오기
getTraining();
//훈련 차시설정 가져오기
getTrainMgmt();
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

// 훈련관리 정보 가져오기
function getTraining() {
  // // console.log("세션 읽어오기 실행중...");
  var html = "";
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/mgmt",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // // console.log(response);
      for (var i = 0; i < response.length; i++) {
        html +=
          '<option value="' +
          response[i].tr_exam_grpname +
          '">' +
          response[i].tr_exam_grpname +
          "</option>";
      }
      // 마지막 탐색 후 select에 option 추가
      $("#selectOne").empty();
      $("#selectTwo").empty();
      $("#selectOne").append(html);
      $("#selectTwo").append(html);
    },
  });
}

// 훈련 시작
function trainingStart() {
  // 무슨 차시가 활성화인지 담을 변수
  var one = $(".check_one").is(":checked");
  var two = $(".check_two").is(":checked");
  // 차시 별 문제그룹 담을 변수
  var groupOne = $("select[name=location1] option:selected").text();
  var groupTwo = $("select[name=location2] option:selected").text();
  // 차시별 문제그룹 설정이 되있는지 boolean 변수
  var groupOneBoolean = $("#selectOne").prop("disabled");
  var groupTwoBoolean = $("#selectTwo").prop("disabled");
  if (
    typeof groupOneBoolean == "undefined" ||
    typeof groupTwoBoolean == "undefined"
  ) {
    $(".training_popup_content").text("훈련 설정이 안된 그룹이 있습니다");
    trainingPopupSwitch();
    return;
  }
  if (one == false && two == false) {
    $(".training_popup_content").text("훈련 시작할 차시를 설정하세요");
    trainingPopupSwitch();
    return;
  }
  // 1차시 훈련 시작
  if (one == true) {
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: groupOne,
    };
    $.ajax({
      url: "http://192.168.32.44:8080/admin/trainingStart",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
        if (response == 0) {
          $(".training_popup_content").text("설정된 훈련이 없습니다");
          trainingPopupSwitch();
          return;
        }
        $(".training_popup_content").text(
          "1차시 훈련(" + groupOne + ")을 시작합니다"
        );
        trainingPopupSwitch();
        // 훈련 시작 버튼 비활성화
        trainingStartBtnOff();
        // 훈련 정지 버튼 활성화
        trainingPauseBtnOn();
        // location.reload();
      },
    });
  } else if (two == true) {
    //2차시 훈련 시작
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: groupTwo,
    };
    $.ajax({
      url: "http://192.168.32.44:8080/admin/trainingStart",
      type: "PATCH",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
        if (response == 0) {
          $(".training_popup_content").text("설정된 훈련이 없습니다");
          trainingPopupSwitch();
          return;
        }
        $(".training_popup_content").text(
          "2차시 훈련(" + groupTwo + ")을 시작합니다"
        );
        trainingPopupSwitch();
        // 훈련 시작 버튼 비활성화
        trainingStartBtnOff();
        // 훈련 정지 버튼 활성화
        trainingPauseBtnOn();
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
      $(".training_popup_content").text("1차시 문제 그룹을 선택하세요");
      trainingPopupSwitch();
      return;
    } else if (one == two) {
      $(".training_popup_content").text(
        "동일한 문제 그룹으로 설정 할 수 없습니다"
      );
      trainingPopupSwitch();
      return;
    }
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: one,
    };
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gprAct",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
        if (response > 0) {
          $(".training_popup_content").text("1차 문제 그룹: " + one);
          trainingPopupSwitch();
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
      $(".training_popup_content").text("2차시 문제 그룹을 선택하세요");
      trainingPopupSwitch();
      return;
    } else if (one == two) {
      $(".training_popup_content").text(
        "동일한 문제 그룹으로 설정 할 수 없습니다"
      );
      trainingPopupSwitch();
      return;
    }
    var jsonData = {
      tr_num: 2,
      tr_exam_grp: two,
    };
    // // console.log(jsonData);
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gprAct",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
        if (response > 0) {
          $(".training_popup_content").text("2차 문제 그룹: " + two);
          trainingPopupSwitch();
          $("#selectTwo").attr("disabled", true);
          // 2차 설정 확인 버튼 비활성화
          ok2BtnOff();
        }
      },
    });
  } else {
    $(".training_popup_content").text("체크박스를 활성화 해주세요");
    trainingPopupSwitch();
  }
}

// 훈련 정지
function trainingPause() {
  $.ajax({
    url: "http://192.168.32.44:8080/admin/trainingPause",
    type: "PATCH",
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      // // console.log(response);
      $(".training_popup_content").text("훈련을 정지합니다");
      trainingPopupSwitch();
      // 훈련 정지 버튼 비활성화
      trainingPauseBtnOff();
      // 훈련 시작 버튼 활성화
      trainingStartBtnOn();
      edit1BtnOn();
      edit2BtnOn();
    },
  });
}

// 그룹 view
function groupView() {
  $(".group_view").css("display", "block");
  $(".group_view_title").css("display", "block");
  $.ajax({
    url: "http://192.168.32.44:8080/admin/groupView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // // console.log(response);
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
  $(".back").toggle();
  scrollPause();
  $.ajax({
    url: "http://192.168.32.44:8080/admin/teamcodeView",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // // console.log(response);
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
      // // console.log("추가");
      // // console.log(html);
      $(".teamcode_view_body").append(html);
    },
  });
}

// 팀코드 뷰 닫기
function teamcode_view_btn() {
  $(".teamcode_view").css("display", "none");
  $(".back").toggle();
  scrollPlay();
}

// 수정 버튼
var editNum; // 몇 번 버튼인지 확인할 변수
function edit(editNum) {
  // // console.log("클릭댐");
  // select에 설정된 값
  var one = $("select[name=location1] option:selected").text();
  var two = $("select[name=location2] option:selected").text();
  if (editNum == 1) {
    // 기존 설정값 비활성화 시키기(grp_act)
    $(".btn_edit1").attr("disabled", true);
    var jsonData = {
      tr_num: 1,
      tr_exam_grp: one,
    };
    // // console.log(jsonData);
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gpract_edit",
      type: "DELETE",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
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
    // // console.log(jsonData);
    $.ajax({
      url: "http://192.168.32.44:8080/admin/gpract_edit",
      type: "DELETE",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // // console.log(response);
        if (response > 0) {
          ok2BtnOn();
          $("#selectTwo").attr("disabled", false);
        }
      },
    });
  }
}

// 훈련 차시 설정에 따른 view 동작 함수
function getTrainMgmt() {
  trainingPauseBtnOff();
  trainingStartBtnOff();
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/get_train_mgmt",
    type: "GET",
    dataType: "json",
    success: function (response) {
      // // console.log("그룹 가져오기:" + response);
      for (var i = 0; i < response.length; i++) {
        // 1차시 설정된 그룹 뿌려주기
        if (response[i].tr_num == 1) {
          $("#selectOne").val(response[i].tr_exam_grp);
          $("#selectOne").attr("disabled", true);
          ok1BtnOff();
          trainingStartBtnOn();
          // 2차시 설정된 그룹 뿌려주기
        } else if (response[i].tr_num == 2) {
          $("#selectTwo").val(response[i].tr_exam_grp);
          $("#selectTwo").attr("disabled", true);
          ok2BtnOff();
          trainingStartBtnOn();
        }
        // 훈련이 시작되었을 경우
        if (response[i].tr_mgmt_state == 1) {
          // 훈련 시작 버튼 비활성화
          trainingStartBtnOff();
          trainingPauseBtnOn();
          // 시작된 훈련이 1차일 경우
          if (response[i].tr_num == 1) {
            $(".check_one").prop("checked", true);
            $(".check_two").prop("disabled", true);
            edit1BtnOff();
            edit2BtnOff();
            // 시작된 훈련이 2차일 경우
          } else if (response[i].tr_num == 2) {
            $(".check_two").prop("checked", true);
            $(".check_one").prop("disabled", true);
            edit1BtnOff();
            edit2BtnOff();
          }
          //훈련이 정지되었을 경우
        } else if (response[i].tr_mgmt_state == 2) {
          trainingPauseBtnOff();
          trainingStartBtnOn();
        }
      }
    },
  });
}

// 훈련 시작 팝업창

function trainingPopupSwitch() {
  let showing = $(".training_popup").css("display");
  if (showing == "block") {
    $(".training_popup").css("display", "none");
  } else if (showing == "none") {
    $(".training_popup").css("display", "block");
  }
  $(".back").toggle();
}
