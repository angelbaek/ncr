/**
 * 문제 풀이 js
 */
// 훈련 시작한 문제 그룹명
var grpName = searchMgmtState();
console.log("훈련 시작 그룹명:" + grpName);
getStartExamAndGrp(grpName);
// 훈련 시작한 그룹 불러오기
function searchMgmtState() {
  var name;
  $.ajax({
    async: false,
    url: "http://192.168.32.44:8080/admin/exam_explanation",
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

function getStartExamAndGrp(grpName) {
  var name;
  var html = "";
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_explanation_sel/" + grpName,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
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
        html +=
          "<div class='common_exam_title'>" +
          response[i].tr_exam_num +
          "번 " +
          response[i].tr_exam_cont +
          "</div>";

        //주관식, 객관식 나누기

        // 객관식
        if (response[i].tr_exam_type == 1) {
          html += "<div class='common_exam_contents'>";

          // 복수정답 단수
          if (response[i].tr_exam_mult_ans == 0) {
            html +=
              '<div><input type="radio" name="multiple">' +
              response[i].tr_exam_choice_1 +
              '</div><div><input type="radio" name="multiple">' +
              response[i].tr_exam_choice_2 +
              '</div><div><input type="radio" name="multiple">' +
              response[i].tr_exam_choice_3 +
              '</div><div><input type="radio" name="multiple">' +
              response[i].tr_exam_choice_4 +
              '</div><div><input type="radio" name="multiple">' +
              response[i].tr_exam_choice_5 +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button>정답확인</button><button>힌트</button>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답:" +
                "</div><div>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답:" +
                "</div><div>감점여부:" +
                "</div></div>";
            }

            // 복수정답 복수
          } else if (response[i].tr_exam_mult_ans == 1) {
            html +=
              '<input type="checkbox">' +
              response[i].tr_exam_choice_1 +
              '<input type="checkbox">' +
              response[i].tr_exam_choice_2 +
              '<input type="checkbox">' +
              response[i].tr_exam_choice_3 +
              '<input type="checkbox">' +
              response[i].tr_exam_choice_4 +
              '<input type="checkbox">' +
              response[i].tr_exam_choice_5;
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button>정답확인</button><button>힌트</button>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답:" +
                "</div><div>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답:" +
                "</div><div>감점여부:" +
                "</div></div>";
            }
          }

          //주관식
        } else if (response[i].tr_exam_type == 2) {
        }
      }
      $(".exam_explanation").empty();
      $(".exam_explanation").append(html);
    },
  });
  return name;
}
// {
/* <div class="individual_exam_common">
            <div>1.문제내용</div>
            <div>객관식,주관식</div>
            <div>
              <button>정답확인</button>
              <button>힌트</button><div>힌트 클릭 시 몇점 감점됩니다.</div>
            </div>
          </div>
          <div class="individual_exam_common">
            <div>첫번째:</div>
            <div>두번째:</div>
            <div>정답 or 감점</div>
          </div>
        </div> */
// }
