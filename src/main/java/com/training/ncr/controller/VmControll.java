//package com.training.ncr.controller;
//
//import com.vmware.vim25.*;
//import com.vmware.vim25.mo.*;
//import org.springframework.stereotype.Service;
//
//import java.net.URL;
//
//@Service
//public class VmControll {
//    public String getVmConsoleUrl(String vmName) {
//        String serverName = "192.168.32.101";
//        String username = "administrator@vsphere.local";
//        String password = "qweR123#001";
//        String consoleUrl = null;
//
//        try {
//            ServiceInstance si = new ServiceInstance(
//                    new URL("https://" + serverName + "/sdk"),
//                    username,
//                    password,
//                    true
//            );
//
//            Folder rootFolder = si.getRootFolder();
//            ManagedEntity[] mes = new InventoryNavigator(rootFolder).searchManagedEntities("VirtualMachine");
//
//            for (ManagedEntity me : mes) {
//                VirtualMachine vm = (VirtualMachine) me;
//                if (vm.getName().equals(vmName)) {
//                    VirtualMachineTicket ticket = vm.acquireTicket("mks");
//                    String host = ticket.getHost();
//                    String port = Integer.toString(ticket.getPort());
//                    String ticketValue = ticket.getTicket();
//
//                    consoleUrl = "https://" + host + ":" + port + "/ticket?ticket=" + ticketValue;
//                    break;
//                }
//            }
//
//            si.getServerConnection().logout();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return consoleUrl;
//    }
//}
package com.training.ncr.controller;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
public class VmControll {
    public String getVmConsoleUrl(String vmName) {
        String serverName = "192.168.32.101";
        String username = "administrator@vsphere.local";
        String password = "qweR123#001";
        String hostName = "cscenter.itzone.local";
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

                    consoleUrl = "https://" + host + "/ui/webconsole.html?vmId=" + vmId +
                            "&vmName=" + vmName +
                            "&serverGuid=" + serverGuid +
                            "&host=" + hostName +
                            "&sessionTicket=" + ticketValue +
                            "&locale=ko-KR";
                    break;
                }
            }

//            si.getServerConnection().logout();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return consoleUrl;
    }
}

