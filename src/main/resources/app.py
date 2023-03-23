import ssl
import time
import OpenSSL
import webbrowser
from pyVim.connect import SmartConnect, Disconnect
from pyVmomi import vim

def get_vm(content, name):
    try:
        name = str(name)
    except TypeError:
        pass

    vm = None
    container = content.viewManager.CreateContainerView(
        content.rootFolder, [vim.VirtualMachine], True)

    for vm_obj in container.view:
        if vm_obj.name == name:
            vm = vm_obj
            break
    return vm

def get_server_guid(content):
    about = content.about
    return about.instanceUuid

def main():
    """
    Simple command-line program to generate a URL
    to open HTML5 Console in Web browser
    """

    # 사용자 입력값 받기
    host = "192.168.32.101"
    port = "443"
    user = "administrator@vsphere.local"
    pwd = "qweR123#001"
    vm_name = "CentOS7_ServerTemp2"

    try:
        si = SmartConnect(
            host=host, user=user, pwd=pwd, port=int(port),
            sslContext=ssl._create_unverified_context()
        )

        content = si.RetrieveContent()

        vm = get_vm(content, vm_name)
        if not vm:
            print(f"Virtual machine '{vm_name}' not found")
            return

        vm_moid = vm._moId
        server_guid = get_server_guid(content)

        vcenter_data = content.setting
        vcenter_settings = vcenter_data.setting
        console_port = '7331'

        for item in vcenter_settings:
            key = getattr(item, 'key')
            if key == 'VirtualCenter.FQDN':
                vcenter_fqdn = getattr(item, 'value')

        session_manager = content.sessionManager
        session = session_manager.AcquireCloneTicket()

        vc_cert = ssl.get_server_certificate((host, int(port)))
        vc_pem = OpenSSL.crypto.load_certificate(
            OpenSSL.crypto.FILETYPE_PEM, vc_cert)
        vc_fingerprint = vc_pem.digest('sha1')

        url = f"https://{host}/ui/webconsole.html?vmId={vm_moid}&vmName={vm_name}&serverGuid={server_guid}&host={vcenter_fqdn}&sessionTicket={session}&thumbprint={vc_fingerprint}"

        print("Open the following URL in your browser to access the "
              "Remote Console.\n"
              "You have 60 seconds to open the URL, or the session"
              "will be terminated.\n")
        webbrowser.open(url)
        print("Waiting for 60 seconds, then exit")
        time.sleep(60)

    except ssl.SSLError as e:
        print(f"SSL Error: {e}")
    except vim.fault.InvalidLogin as e:
        print(f"Invalid Login: {e}")
    except vim.fault.VimFault as e:
        print(f"VimFault: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        Disconnect(si)

if __name__ == "__main__":
    main()
