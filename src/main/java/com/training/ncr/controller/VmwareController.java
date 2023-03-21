package com.training.ncr.controller;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.rmi.RemoteException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@RestController
@CrossOrigin
public class VmwareController {

    @GetMapping("/getVmConsoleUrl")
    public void test() throws IOException, URISyntaxException {
        String vmName = "CentOS7_ServerTemp2"; // 웹콘솔을 띄울 가상 머신의 이름
        String vCenterUrl = "https://192.168.32.101/sdk"; // vCenter 서버의 URL
        String username = "administrator@vsphere.local"; // vCenter 서버에 로그인하는 사용자 이름
        String password = "qweR123#001"; // vCenter 서버에 로그인하는 사용자 비밀번호
        String hostName = "cscenter.itzone.local";
        String ssltext = "BD:D7:F8:E5:21:F9:3D:59:BC:A4:27:98:7D:41:C4:E3:B6:67:1A:65";

        // vCenter 서버에 연결
        ServiceInstance si = new ServiceInstance(new URL(vCenterUrl), username, password, true);

        // 가상 머신 객체 가져오기
        VirtualMachine vm = (VirtualMachine) new InventoryNavigator(si.getRootFolder()).searchManagedEntity("VirtualMachine", vmName);
        //HostSystem host = (HostSystem) new InventoryNavigator(si.getRootFolder()).searchManagedEntity("HostSystem", hostName);
        HostSystem host = (HostSystem) new InventoryNavigator(
                si.getRootFolder()).searchManagedEntity("HostSystem",
                "name=" + hostName);
        AboutInfo aboutInfo = si.getAboutInfo();
        String serverGuid = aboutInfo.getInstanceUuid();

        // VM의 콘솔 URL 생성하기
        VirtualMachineTicket ticket = vm.acquireTicket("webmks");
        String webConsoleUrl = "https://" + si.getServerConnection().getUrl().getHost() + "/ui/webconsole.html?" +
                "vmId=" + vm.getMOR().getVal() +
                "&vmName=" + vm.getName() +
                "&serverGuid=" + serverGuid +
                "&host=" + hostName +
                "&sessionTicket=" + ticket.getTicket() + "--tp-" + ssltext +
                "&thumbprint=" +ssltext+
                "&locale=en_US";
        System.out.println(webConsoleUrl);
    }
}