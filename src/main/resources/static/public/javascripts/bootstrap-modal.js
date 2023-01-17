"use strict";

$("#modal-1").fireModal({body: 'Modal body text goes here.'});
$("#modal-2").fireModal({body: 'Modal body text goes here.', center: true});

let modal_3_body = '<p>Object to create a button on the modal.</p><pre class="language-javascript"><code>';
modal_3_body += '[\n';
modal_3_body += ' {\n';
modal_3_body += "   text: 'Login',\n";
modal_3_body += "   submit: true,\n";
modal_3_body += "   class: 'btn btn-primary btn-shadow',\n";
modal_3_body += "   handler: function(modal) {\n";
modal_3_body += "     alert('Hello, you clicked me!');\n"
modal_3_body += "   }\n"
modal_3_body += ' }\n';
modal_3_body += ']';
modal_3_body += '</code></pre>';
$("#modal-3").fireModal({
  title: 'Modal with Buttons',
  body: modal_3_body,
  buttons: [
    {
      text: 'Click, me!',
      class: 'btn btn-primary btn-shadow'
    }
  ]
});

$("#modal-4").fireModal({
  footerClass: 'bg-whitesmoke',
  body: 'Add the <code>bg-whitesmoke</code> class to the <code>footerClass</code> option.',
  buttons: [
    {
      text: 'No Action!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-5").fireModal({
  title: 'Login',
  body: $("#modal-login-part"),
  footerClass: 'bg-whitesmoke',
  autoFocus: false,
  onFormSubmit: function(modal, e, form) {
    // Form Data
    let form_data = $(e.target).serialize();
    console.log(form_data)

    // DO AJAX HERE
    let fake_ajax = setTimeout(function() {
      form.stopProgress();
      modal.find('.modal-body').prepend('<div class="alert alert-info">Please check your browser console</div>')

      clearInterval(fake_ajax);
    }, 1500);

    e.preventDefault();
  },
  shown: function(modal, form) {
    console.log(form)
  },
  buttons: [
    {
      text: 'Login',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-6").fireModal({
  body: '<p>Now you can see something on the left side of the footer.</p>',
  created: function(modal) {
    modal.find('.modal-footer').prepend('<div class="mr-auto"><a href="#">I\'m a hyperlink!</a></div>');
  },
  buttons: [
    {
      text: 'No Action',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$('.oh-my-modal').fireModal({
  title: 'My Modal',
  body: 'This is cool plugin!'
});

let modal_7_body = '윈도우 내장 명령어를 사용하여 확인 가능합니다.';

$('#modal-7').fireModal({
  title: '힌트 ',
  body: modal_7_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },

    // {
    //   text: '취소',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(current_modal) {
    //     $.destroyModal(current_modal);
    //     }
    // }
   
  ]
});

let modal_8_body = '위 문제에서 사용한 명령어에 옵션을 추가하여 확인 가능합니다.';

$('#modal-8').fireModal({
  title: '힌트 ',
  body: modal_8_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },

    // {
    //   text: '취소',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(current_modal) {
    //     $.destroyModal(current_modal);
    //     }
    // }
   
  ]
});

let modal_9_body = 'PC 설정 -> 시스템 -> 정보에서 해당 PC의 OS와 버전을 확인할 수 있습니다.';

$('#modal-9').fireModal({
  title: '힌트 ',
  body: modal_9_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});


let modal_10_body = '제공한 도구중 하나를 사용하여 위 경로에 들어가면 확인 가능합니다.';

$('#modal-10').fireModal({
  title: '힌트',
  body: modal_10_body,
  buttons: [
    // {
    //   text: '저장',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_11_body = 'Autoruns에서 Image Path 부분을 보면 확인 가능합니다.';

$('#modal-11').fireModal({
  title: '힌트 ',
  body: modal_11_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});


let modal_12_body = '총 획득한 점수 : 30 <br>풀이 개수 : 3/40<br>정답 점수: 30 <br> 오답 감점 : 35 <br> 힌트 감점 : 10  <br><br> 종료하면 문제 풀이할 수 없습니다. ';

$('#modal-12').fireModal({
  title: '제출하기',
  body: modal_12_body,
  buttons: [
    {
      text: '다시 풀기',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '제출하기',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_13_body = '훈련을 시작하시겠습니까?.';

$('#modal-13').fireModal({
  title: '훈련 시작',
  body: modal_13_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_14_body = '훈련을 정지 하시겠습니까?.';

$('#modal-14').fireModal({
  title: '훈련 정지',
  body: modal_14_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_15_body = '그룹을 조회 하시겠습니까?';

$('#modal-15').fireModal({
  
  title: '그룹 조회',
  body: modal_15_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        var field = document.getElementById("test");
        var newDIV = document.createElement('div');
        newDIV.innerHTML = `<div style="border:1px solid; padding:15px">
        <div class="card-body" style="margin-left:3%;">
         
        
          <div class="form-group">
            <div class="card">
         
              <div class="card-body">
                <table class="table" >
                  <thead style="text-align:center">
                    <tr>
                      <th scope="col">이름</th>
                      <th scope="col">기관</th>
                      <th scope="col">팀 코드</th>
                      <th scope="col">팀 (조)</th>
                      

                    </tr>
                  </thead>
                  <tbody style="text-align:center">
                    <tr>
                      <td>훈련자 1</td>
                      <td>A</td>
                      <td>TEAM001</td>
                      <td>1조</td>
                     
                      
                    </tr>
                    <tr>
                      <td>훈련자 2</td>
                      <td>B</td>
                      <td>TEAM001</td>
                      <td>1조</td>
                    
                      
                    </tr>
                    <tr>
                      <td>훈련자 3</td>
                      <td>C</td>
                      <td>TEAM002</td>
                      <td>2조</td>
                     
                      
                    </tr>
                    <tr>
                    <td>훈련자 4</td>
                    <td>A</td>
                    <td>TEAM002</td>
                    <td>2조</td>
                   
                    
                  </tr>
                  <tr>
                    <td>훈련자 5</td>
                    <td>B</td>
                    <td>TEAM003</td>
                    <td>3조</td>
                  
                    
                  </tr>
                  <tr>
                    <td>훈련자 6</td>
                    <td>C</td>
                    <td>TEAM003</td>
                    <td>3조</td>
                   
                    
                  </tr>
                  
            
                 
                  
                </tr>
                 
                  
                </tr>
                 
                  
                </tr>
                 
                  
                </tr>
                 
                  
                </tr>
                  
                </tr>
                 
                  
                </tr>


                  </tbody>
                </table>
              </div>
            </div>
            
            <br>
        </div>

       
      </div>
    </div>`;
        field.append(newDIV)
        $.destroyModal(current_modal);
      }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }  
  ]
});

let modal_16_body = '팀 코드를 조회 하시겠습니까?';

$('#modal-16').fireModal({
  title: '팀 코드 조회',
  body: modal_16_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_17_body = '문제를 초기화 하시겠습니까?.';

$('#modal-17').fireModal({
  title: '문제 초기화',
  body: modal_17_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_18_body = '문제를 저장 하시겠습니까?.';

$('#modal-18').fireModal({
  title: '문제 저장',
  body: modal_18_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
       handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_19_body = '정답을 확인 하시겠습니까?.';

$('#modal-19').fireModal({
  title: '정답 확인',
  body: modal_19_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_20_body = '정답을 확인 하시겠습니까?.';

$('#modal-20').fireModal({
  title: '정답 확인',
  body: modal_20_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_21_body = '정답을 확인 하시겠습니까?.';

$('#modal-21').fireModal({
  title: '정답 확인',
  body: modal_21_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_22_body = '정답을 확인 하시겠습니까?.';

$('#modal-22').fireModal({
  title: '정답 확인',
  body: modal_22_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_23_body = '문제를 추가 하시겠습니까?.';

$('#modal-23').fireModal({
  title: '문제 추가',
  body: modal_23_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_24_body = '문제를 삭제 하시겠습니까?.';

$('#modal-24').fireModal({
  title: '문제 삭제',
  body: modal_24_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_25_body = '제공한 도구들 중 하나를 이용하면 확인 가능합니다.';

$('#modal-25').fireModal({
  title: '힌트 ',
  body: modal_25_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_26_body = 'LastActivityView를 열어 ‘natsvc.exe’가 실행된 시간의 전 후를 찾아 분석하면 됩니다.';

$('#modal-26').fireModal({
  title: '힌트 ',
  body: modal_26_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_27_body = 'Sysmon 이벤트로그를 열어 natsvc.exe에 관련된 로그를 보고 DestinationIp를 확인하면 됩니다.';

$('#modal-27').fireModal({
  title: '힌트 ',
  body: modal_27_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_28_body = '피해 서버 홈페이지 게시판에 등록된 URL을 찾으면 됩니다.';

$('#modal-28').fireModal({
  title: '힌트 ',
  body: modal_28_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_29_body = '주어진 도구를 사용하여 위 문제의 답인 URL에 접속한 흔적을 찾으면 됩니다.';

$('#modal-29').fireModal({
  title: '힌트 ',
  body: modal_29_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_30_body = 'log4j는 화면 인터페이스에서 동작하는 취약점입니다.';

$('#modal-30').fireModal({
  title: '힌트 ',
  body: modal_30_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_31_body = '프로젝트 디렉토리 경로는 /usr/project/log4shell-vulnerable-app-main에 있습니다.';

$('#modal-31').fireModal({
  title: '힌트 ',
  body: modal_31_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_32_body = '의존성 설정 파일에서 버전을 확인할 수 있습니다.';

$('#modal-32').fireModal({
  title: '힌트 ',
  body: modal_32_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_33_body = 'log4j는 화면 인터페이스에서 동작하는 취약점입니다.';

$('#modal-33').fireModal({
  title: '힌트 ',
  body: modal_33_body,
  buttons: [
    // {
    //   text: '확인',
    //   class: 'btn btn-primary btn-shadow',
    //   handler: function(modal) {
    //   }
    // },

    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
   
  ]
});

let modal_40_body = '정답을 확인 하시겠습니까?.';

$('#modal-40').fireModal({
  title: '정답 확인',
  body: modal_40_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});

let modal_41_body = '정답을 확인 하시겠습니까?.';

$('#modal-41').fireModal({
  title: '정답 확인',
  body: modal_41_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_42_body = '정답을 확인 하시겠습니까?.';

$('#modal-42').fireModal({
  title: '정답 확인',
  body: modal_42_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});



let modal_43_body = '정답을 확인 하시겠습니까?.';

$('#modal-43').fireModal({
  title: '정답 확인',
  body: modal_43_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_44_body = '정답을 확인 하시겠습니까?.';

$('#modal-44').fireModal({
  title: '정답 확인',
  body: modal_44_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_45_body = '정답을 확인 하시겠습니까?.';

$('#modal-45').fireModal({
  title: '정답 확인',
  body: modal_45_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_46_body = '정답을 확인 하시겠습니까?.';

$('#modal-46').fireModal({
  title: '정답 확인',
  body: modal_46_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_47_body = '정답을 확인 하시겠습니까?.';

$('#modal-47').fireModal({
  title: '정답 확인',
  body: modal_47_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_48_body = '정답을 확인 하시겠습니까?.';

$('#modal-48').fireModal({
  title: '정답 확인',
  body: modal_48_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});


let modal_49_body = '정답을 확인 하시겠습니까?.';

$('#modal-49').fireModal({
  title: '정답 확인',
  body: modal_49_body,
  buttons: [
    {
      text: '확인',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    },
    {
      text: '취소',
      class: 'btn btn-primary btn-shadow',
      handler: function(current_modal) {
        $.destroyModal(current_modal);
        }
    }
  ]
});











