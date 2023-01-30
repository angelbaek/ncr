/**
 * 문제 풀이 js
 */
getSessionUserInfo();

// 훈련 시작한 문제 그룹명
var grpName = searchMgmtState();
console.log("훈련 시작 그룹명:" + grpName);

// 훈련 시작한 그룹 불러오기
function searchMgmtState() {
  var name;
  $.ajax({
    async: false,
    url: "http://localhost:8080/admin/exam_explanation",
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
