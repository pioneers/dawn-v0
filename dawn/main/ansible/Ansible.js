import dgram from 'dgram';
import ProtoBuf from 'protobufjs';

const builder = ProtoBuf.loadProtoFile('./main/ansible/ansible.proto');
const Ansible = builder.build('main');
const AnsibleMessage = Ansible.AnsibleMessage;

const server = dgram.createSocket({
  type: 'udp4',
  reuseAddr: true,
});

server.on('message', (msg) => {
  const parsed = AnsibleMessage.decode(msg);
  const data = Ansible[parsed.type].decode(parsed.data);
  console.log(data);
});

server.bind(12345, '127.0.0.1');
