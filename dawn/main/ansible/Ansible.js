import dgram from 'dgram';
import ProtoBuf from 'protobufjs';

const builder = ProtoBuf.loadProtoFile('./main/ansible/ansible.proto');
const AnsibleMain = builder.build('main');
const AnsibleMessage = AnsibleMain.AnsibleMessage;

const Ansible = {
  connect() {
    const server = dgram.createSocket({
      type: 'udp4',
    });

    server.on('message', (msg) => {
      const parsed = AnsibleMessage.decode(msg);
      const data = AnsibleMain[parsed.type].decode(parsed.data);
      if (Ansible.callback) {
        Ansible.callback(parsed.type, data);
      }
    });

    server.bind(12345, '127.0.0.1');
  },

  on(callback) {
    Ansible.callback = callback;
  },
};

export default Ansible;
