from flask import Flask, jsonify
from pyVim.connect import SmartConnectNoSSL, Disconnect
from pyVmomi import vim
import atexit
import ssl
import time
import OpenSSL
import webbrowser

app = Flask(__name__)

# vSphere 정보
vcenter = '192.168.32.101'
username = 'administrator@vsphere.local'
password = 'qweR123#001'

# vSphere 연결 설정
si = SmartConnectNoSSL(host=vcenter, user=username, pwd=password)
atexit.register(Disconnect, si)


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


@app.route('/vmware/connect')
def vmware_connect():
    vm_name = 'CentOS7_ServerTemp2'

    content = si.RetrieveContent()
    vm = get_vm(content, vm_name)
    vm_moid = vm._moId

    vcenter_data = content.setting
    vcenter_settings = vcenter_data.setting
    console_port = '7331'
    vcenter_fqdn = ''
    for item in vcenter_settings:
        key = getattr(item, 'key')
        if key == 'cscenter.itzone.local':
            vcenter_fqdn = getattr(item, 'value')

    session_manager = content.sessionManager
    session = session_manager.AcquireCloneTicket()

    vc_cert = ssl.get_server_certificate((vcenter, 443))
    vc_pem = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, vc_cert)
    vc_fingerprint = vc_pem.digest('sha1')

    url = ("http://" + vcenter + ":" + console_port + "/console/?vmId="
           + str(vm_moid) + "&vmName=" + vm_name + "&host=" + vcenter_fqdn
           + "&sessionTicket=" + session + "&thumbprint=" + str(vc_fingerprint))

    webbrowser.open(url)

    return jsonify({'message': 'VMware console opened successfully.'})


if __name__ == '__main__':
    app.run()
