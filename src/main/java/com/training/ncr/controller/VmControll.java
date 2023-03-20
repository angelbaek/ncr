package com.training.ncr.controller;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
public class VmControll {
    public String getVmConsoleUrl(String vmName) {
        String serverName = "172.10.100.11";
        String username = "jinseok.yang";
        String password = "VMware1!";
        String hostName = "h0015.cstec.kr"; // 호스트 이름 변경
        String consoleUrl = null;

        try {
            ServiceInstance si = new ServiceInstance(
                    new URL("https://" + serverName + "/sdk"),
                    username,
                    password,
                    true
            );

            Folder rootFolder = si.getRootFolder();
            ManagedEntity[] mes = new InventoryNavigator(rootFolder).searchManagedEntities("VirtualMachine");

            for (ManagedEntity me : mes) {
                VirtualMachine vm = (VirtualMachine) me;
                if (vm.getName().equals(vmName)) {
                    VirtualMachineTicket ticket = vm.acquireTicket("webmks");
                    String host = si.getServerConnection().getUrl().getHost();
                    String ticketValue = ticket.getTicket();
                    String serverGuid = si.getAboutInfo().getInstanceUuid();
                    String vmId = vm.getMOR().get_value();

                    consoleUrl = "https://55.55.11.11/admin/systems/console?" + // URL 변경
                            "result=true" +
                            "&ticket=" + ticketValue +
                            "&port=443" +
                            "&host=" + hostName +
                            "&vm_name=" + vmName;
                    break;
                }
            }

//            si.getServerConnection().logout(); // 주석 처리
        } catch (Exception e) {
            e.printStackTrace();
        }
        return consoleUrl;
    }
}