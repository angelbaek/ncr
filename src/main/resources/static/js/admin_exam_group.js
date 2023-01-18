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

{
  /* <input type="radio" name="double" />; */
}
