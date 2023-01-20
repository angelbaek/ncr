/**
 * 문항 관리 js
 */
examGroupCall();
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
      for (var i = 0; i < response[0].tr_exam_count; i++) {
        html +=
          "<tr><td onclick='exam(" +
          (i + 1) +
          ")'>" +
          (i + 1) +
          "번 문제" +
          "</td></tr>";
      }
      $(".tr_add").empty();
      $(".tr_add").append(html);
    },
  });
}

// 개별 문제 불러오기
var exam_num;
function exam(exam_num) {
  alert(exam_num + "번 선택됨");
}
