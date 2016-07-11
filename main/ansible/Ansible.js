import { ipcMain } from 'electron';
import ProtoBuf from 'protobufjs';
import dgram from 'dgram';
import _ from 'lodash';

const hostname = 'localhost';
const clientPort = '12345'; // send port
const client = dgram.createSocket('udp4');

const builder = ProtoBuf.loadProtoFile('./main/ansible/ansible.proto');
const AnsibleMain = builder.build('main');
const DawnData = AnsibleMain.DawnData;
const StudentCodeStatus = DawnData.StudentCodeStatus;

/**
 * Serialize the data using protocol buffers.
 */
function buildProto(data) {
  const status = data.stuentCodeStatus ?
    StudentCodeStatus.TELEOP : StudentCodeStatus.IDLE;
  const gamepads = _.map(_.toArray(data.gamepads), (gamepad) => {
    const axes = _.toArray(gamepad.axes);
    const buttons = _.map(_.toArray(gamepad.buttons), Boolean);
    const GamepadMsg = new DawnData.Gamepad({
      index: gamepad.index,
      axes,
      buttons,
    });
    return GamepadMsg;
  });
  const message = new DawnData({
    gamepads,
    student_code_status: status,
  });
  return message;
}

ipcMain.on('stateUpdate', (event, data) => {
  const message = buildProto(data);
  const buffer = message.encode().toBuffer();
  // Send the buffer over UDP to the robot.
  client.send(buffer, clientPort, hostname, (err) => {
    if (err) {
      console.error('UDP socket error on send:', err);
    }
  });
});
