package com.training.ncr.controller;
import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;

import java.net.URL;

public class VmControll {
    public static void main(String[] args) {
        String serverName = "your-vcenter-server";
        String username = "your-username";
        String password = "your-password";

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
                String vmName = vm.getName();
                System.out.println("Virtual Machine Name: " + vmName);

                if (vmName.equals("test")) {
                    VirtualMachinePowerState powerState = vm.getRuntime().getPowerState();
                    if (powerState == VirtualMachinePowerState.poweredOff) {
                        System.out.println("Powering on the virtual machine: " + vmName);
                        Task task = vm.powerOnVM_Task(null);
                        String result = task.waitForTask();
                        if (result == Task.SUCCESS) {
                            System.out.println("Virtual machine " + vmName + " powered on successfully.");
                        } else {
                            System.out.println("Failed to power on the virtual machine " + vmName);
                        }
                    } else {
                        System.out.println("The virtual machine " + vmName + " is already running.");
                    }
                }
            }

            si.getServerConnection().logout();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}