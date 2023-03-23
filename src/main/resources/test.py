import requests
from pyVim.connect import SmartConnect, Disconnect

# vCenter 서버에 로그인
si = SmartConnect(
    host='192.168.32.101',
    user='administrator@vsphere.local',
    pwd='qweR123#001',
    port=int(443)
)

# sessionTicket 및 thumbprint 얻기
clone_ticket = si.content.sessionManager.AcquireCloneTicket()
thumbprint = si._stub.host.thumbprint

# vSphere API와 연결 끊기
Disconnect(si)

# URL에 대한 요청 시 인증 정보 추가
url = 'https://192.168.32.101/ui/webconsole.html?vmId=vm-1701&vmName=CentOS7_ServerTemp2&serverGuid=93b211b1-3357-4499-b612-2337c34201d3&host=cscenter.itzone.local'
headers = {
    'vmware-api-session-id': clone_ticket,
    'X-VMWARE-VCENTER-SESSION-THUMBPRINT': thumbprint,
}
response = requests.get(url, headers=headers, verify=False)
