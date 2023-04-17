package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamManagementService;
import com.training.ncr.vo.admin.*;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/admin")
public class ExamManagementController {

    @Autowired
    ExamManagementService examManagementService;

    // 그룹 정보 불러오기
    @GetMapping("/exam_mng_grp")
    public List<ExamGrpVO> getExamGrp(){
        return examManagementService.getExamGrp();
    }

    // 선택된 문제그룹 문항 수 가져오기
    @GetMapping("/exam_mng_grp/{grpId}")
    public List<ExamGrpVO> getExamGrpCount(@PathVariable int grpId){
        return examManagementService.getExamGrpCount(grpId);
    }

    // 선택한 문제 내용 가져오기
    @PostMapping("/exam_call")
    public List<ExamVO> getExam(@RequestBody ExamVO examVO){
        return examManagementService.getExam(examVO);
    };

    // 선택한 문항이 설정되지 않았을때
    @PostMapping("/exam_call_none")
    public int insertNoneExam(@RequestBody ExamVO examVO){
        return examManagementService.insertNoneExam(examVO);
    }

    // 선택한 문항 문제id 가져오기
    @PostMapping("/exam_id_get")
    public List<ExamVO> examIdGet(@RequestBody ExamVO examVO){
        return examManagementService.examIdGet(examVO);
    }

    // 힌트 db 추가
    @PostMapping("/hint_insert")
    public int hintInsert(@RequestBody ExamHintVO examHintVO){
        return examManagementService.hintInsert(examHintVO);
    }

    // 힌트 업데이트
    @PatchMapping("/hintUpdate")
    public int hintUpdate(@RequestBody ExamHintVO examHintVO){
        return examManagementService.hintUpdate(examHintVO);
    }

    // 문제 id만 가져오기
    @PostMapping("/only_get_examid")
    public String getExamId(@RequestBody ExamVO examVO){
        return examManagementService.getExamId(examVO);
    }

    // 전술단계 가져오기
    @GetMapping("/get_tactics")
    public List<TacticsVO> getTactics(){
        return examManagementService.getTactics();
    }

    // 전술단계 저장
    @PatchMapping("/update_tactic")
    public int updateTactics(@RequestBody ExamVO examVO){
        return examManagementService.updateTactics(examVO);
    }

    // 문제 최종저장
    @PatchMapping("/exam_final_save")
    public int updateExamFinal(@RequestBody ExamVO examVO){
        return examManagementService.updateExamFinal(examVO);
    }

    // 문제 그룹id로 matrix 가져오기
    @PostMapping("/get_matrix")
    public List<MatrixVO> getMiterMatrixByGrpid(@RequestBody MatrixVO matrixVO){
        return examManagementService.getMiterMatrixByGrpid(matrixVO);
    }

    // csv 읽어서 문제 업로드
    @PatchMapping("/exam_update_csv")
    public int examUpdateByCsv(@RequestBody ExamVO examVO){
        return examManagementService.examUpdateByCsv(examVO);
    }

    @PostMapping("/uploadFile")
    public String uploadFile(@RequestParam("fileInput") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            String fileName = UUID.randomUUID().toString() + "." + extension;
            File targetFile = new File("/path/to/upload/directory/" + fileName);
            FileUtils.writeByteArrayToFile(targetFile, file.getBytes());
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file";
        }
    }

    // csv파일을 읽기 위한 문항수 가져오기
    @GetMapping("/get_exam_length/{exam_grpid}")
    public int getExamLength(@PathVariable int exam_grpid){
        return examManagementService.getExamLength(exam_grpid);
    }

    // 해당 힌트 가져오기
    @PostMapping("/get_hint_contents")
    public Map<String,Object> getHintContents(@RequestBody Map<String,Object> map){
        return examManagementService.getHintContents(map);
    }
}
