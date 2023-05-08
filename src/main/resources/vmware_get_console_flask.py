from flask import Flask, jsonify, request
from pyVim.connect import SmartConnect, Disconnect
from pyVmomi import vim
import ssl
import atexit
import argparse
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/vmware_console_url', methods=['POST'])
def get_vmware_console_url():
    # POST 요청에서 인자 추출
    args = request.json
    host = args['host']
    username = args.get('username', 'administrator@vsphere.local')
    password = args['password']
    target = args['target']

    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    context.load_cert_chain('C:/Users/ItzoneLab/ncr/src/main/resources/ssl/server.crt', 'C:/Users/ItzoneLab/ncr/src/main/resources/ssl/server.key')
    context.check_hostname = False

    try:
        si = SmartConnect(host=host,
                          user=username,
                          pwd=password,
                          sslContext=context)
        atexit.register(Disconnect, si)
    except Exception as e:
        return jsonify({'error': str(e)})

    content = si.content
    vms = content.viewManager.CreateContainerView(content.rootFolder,
                                                  [vim.VirtualMachine],
                                                  True)
    
    vm_obj = ''
    if vms:
        for vm in vms.view:
            if vm.name == target:
                vm_obj = vm
                break                

    if vm_obj:
        ticket_info = vm_obj.AcquireTicket("webmks")
        host = ticket_info.host
        port = ticket_info.port
        ticket = ticket_info.ticket

        if host:
            return jsonify({'url': 'wss://%s:%s/ticket/%s' % (host, port, ticket)})
        else:
            return jsonify({'error': 'WebSocket URL 생성 실패'})
    else:
        return jsonify({'error': 'VM not found'})

if __name__ == '__main__':
    app.run(ssl_context=('C:/Users/ItzoneLab/ncr/src/main/resources/ssl/server.crt', 'C:/Users/ItzoneLab/ncr/src/main/resources/ssl/server.key'), host='0.0.0.0', port=5000)
