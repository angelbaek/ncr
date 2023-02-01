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
        // 문제 그룹 id
        var grpid = response[i].tr_exam_grpid;
        // 문제 id
        var examid = response[i].tr_exam_id;
        html +=
          "<div class='common_exam_title'>" +
          response[i].tr_exam_num +
          ". " +
          response[i].tr_exam_cont +
          " <p>(난이도:" +
          levelTxt +
          " 배점:" +
          response[i].tr_exam_point +
          ")</p></div>";

        //주관식, 객관식 나누기

        // 객관식
        if (response[i].tr_exam_type == 1) {
          html += "<div class='common_exam_contents'>";

          // 복수정답 단수
          if (response[i].tr_exam_mult_ans == 0) {
            html +=
              '<div><input type="radio" name="multiple" value="1">' +
              response[i].tr_exam_choice_1 +
              '</div><div><input type="radio" name="multiple" value="2">' +
              response[i].tr_exam_choice_2 +
              '</div><div><input type="radio" name="multiple" value="3">' +
              response[i].tr_exam_choice_3 +
              '</div><div><input type="radio" name="multiple" value="4">' +
              response[i].tr_exam_choice_4 +
              '</div><div><input type="radio" name="multiple" value="5">' +
              response[i].tr_exam_choice_5 +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</p></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                response[i].tr_exam_id +
                "'>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답: " +
                response[i].tr_exam_ans +
                "</div><div>감점여부:" +
                "</div></div>";
            }

            // 복수정답 복수
          } else if (response[i].tr_exam_mult_ans == 1) {
            html +=
              '<div><input type="checkbox" class="mult_ans_input" value="1">' +
              response[i].tr_exam_choice_1 +
              '</div><div><input type="checkbox" class="mult_ans_input" value="2">' +
              response[i].tr_exam_choice_2 +
              '</div><div><input type="checkbox" class="mult_ans_input" value="3">' +
              response[i].tr_exam_choice_3 +
              '</div><div><input type="checkbox" class="mult_ans_input" value="4">' +
              response[i].tr_exam_choice_4 +
              '</div><div><input type="checkbox" class="mult_ans_input" value="5">' +
              response[i].tr_exam_choice_5 +
              "</div>";
            // 힌트 사용
            if (response[i].tr_exam_hint_flg == 1) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button><button onclick='getHintFunc(" +
                grpid +
                "," +
                examid +
                "," +
                response[i].tr_hint_deduct +
                ")'>힌트</button><p>힌트 사용 시 " +
                response[i].tr_hint_deduct +
                "점 감점됩니다</p></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답: " +
                response[i].tr_exam_ans +
                "</div><div class='exam_deduct_status_" +
                response[i].tr_exam_id +
                "'>감점여부:" +
                "</div></div>";
              // 힌트 미사용
            } else if (response[i].tr_exam_hint_flg == 0) {
              html +=
                "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button></div>" +
                "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
                "</div><div>두번째:" +
                "</div><div>정답: " +
                response[i].tr_exam_ans +
                "</div><div>감점여부:" +
                "</div></div>";
            }
          }

          //주관식
        } else if (response[i].tr_exam_type == 2) {
          html +=
            "<div class='common_exam_contents'><input type='text' class='common_short_form'>";
          // 힌트 사용
          if (response[i].tr_exam_hint_flg == 1) {
            html +=
              "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button><button onclick='getHintFunc(" +
              grpid +
              "," +
              examid +
              "," +
              response[i].tr_hint_deduct +
              ")'>힌트</button><p>힌트 사용 시 " +
              response[i].tr_hint_deduct +
              "점 감점됩니다</p></div>" +
              "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
              "</div><div>두번째:" +
              "</div><div>정답: " +
              response[i].tr_exam_ans +
              "</div><div class='exam_deduct_status_" +
              response[i].tr_exam_id +
              "'>감점여부:" +
              "</div></div>";
            // 힌트 미사용
          } else if (response[i].tr_exam_hint_flg == 0) {
            html +=
              "<div class='ans_hint_div'><button class='common_ans_btn'>정답확인</button></div>" +
              "</div><div class='common_exam_contents' id='ans_result_div'><div>첫번째:" +
              "</div><div>두번째:" +
              "</div><div>정답: " +
              response[i].tr_exam_ans +
              "</div><div class='exam_deduct_status_" +
              response[i].tr_exam_id +
              "'>감점여부:" +
              "</div></div>";
          }
        }
      }
      $(".exam_explanation").empty();
      $(".exam_explanation").append(html);
    },
  });
  return name;
}
// 힌트사용한 변수
var arrHintUsed = {};
// 힌트감점 변수
var hintDeduct = 0;
function getHintFunc(grpid, examid, deduct) {
  console.log("힌트 함수: " + grpid + ", " + examid);
  var jsonData = {
    tr_exam_grpid: grpid,
    tr_exam_id: examid,
  };
  $.ajax({
    url: "http://192.168.32.44:8080/admin/exam_hint_get",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(jsonData),
    success: function (response) {
      console.log(response);
      alert(response[0].tr_exam_hint);
      if (arrHintUsed[examid] != true) {
        hintDeduct += deduct;
        $(".total_hint_deduct").text("힌트감점:" + hintDeduct);
        $(".exam_deduct_status_" + examid).text(deduct + "점 감점되었습니다.");
      }
      arrHintUsed[examid] = true;
    },
  });
}
