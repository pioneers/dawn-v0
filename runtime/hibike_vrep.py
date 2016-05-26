import vrep

import ctypes as ct
def simxReadForceSensor(clientID, forceSensorHandle, operationMode):
    '''
    Please have a look at the function description/documentation in the V-REP user manual
    '''
    state = ct.c_ubyte()
    forceVector  = (ct.c_float*3)()
    torqueVector = (ct.c_float*3)()
    ret = vrep.c_ReadForceSensor(clientID, forceSensorHandle, ct.byref(state), forceVector, torqueVector, operationMode)
    arr1 = []
    for i in range(3):
        arr1.append(forceVector[i])
    arr2 = []
    for i in range(3):
        arr2.append(torqueVector[i])
    if True:#sys.version_info[0] == 3:
        state=state.value
    else:
        state=ord(state.value)
    return ret, state, arr1, arr2

class VRepInterface(object):
    instance = None
    @staticmethod
    def get_interface():
        if VRepInterface.instance is None:
            VRepInterface.instance = VRepInterface()
        return VRepInterface.instance

    def __init__(self):
        vrep.simxFinish(-1) # just in case, close all opened connections
        self.clientID=vrep.simxStart('127.0.0.1',19997,True,True,5000,5) # Connect to V-REP
        if self.clientID == -1:
            raise Exception("VRep not running!!!")
        self.opmode = vrep.simx_opmode_oneshot_wait
        vrep.simxStartSimulation(self.clientID, self.opmode)
        self.hw_info = self._get_hw_info()

    def _get_hw_info():
        code, s = vrep.simxGetStringSignal(clientID, "hw_info", vrep.simx_opmode_oneshot_wait)
        if code != 0:
            return None
        res = {}
        for info in s.split(";"):
            if not info:
                continue
            info = dict([entry.split("=") for entry in info.split(",")])
            res[info["name"][1:-1]] = {k:int(v) for k,v in info.items() if k!='name'}
        return res

    def get_id(self, name):
        return self.hw_info[name]['id']

    def set_motor(self, name, value):
        v = value / 100.0
        vrep.simxSetJointTargetVelocity(self.clientID,
                self.get_id(name),
                    v,
                    self.opmode)

    def get_force_sensor(self, name):
        code, state, forces, torques = simxReadForceSensor(
            self.clientID,
            self.get_id(name),
            self.opmode
        )
        return (forces[0], forces[1], forces[2], 0.0)

    def get_device_type(self, name):
        tp = self.hw_info[name]['type']
        if tp == vrep.sim_object_joint_type:
            return "motor"
        elif tp == vrep.sim_object_forcesensor_type:
            return "force_sensor"
        else:
            return None

class Hibike(object):
    def __init__(self):
        self.v = VRepInterface.get_interface()

    def getEnumeratedDevices(self):
        """ Returns a list of tuples of UIDs and device types. """
        enum_devices = []
        for UID in self.v.hw_info:
            tp = self.v.get_device_type(UID)
            if tp == "force_sensor":
                enum_devices.append((UID, 0x0002))
        return enum_devices

    def subToDevices(self, *args):
        """ deviceList - List of tuples of UIDs and delays.
        """
        return 0 # no need to subscribe, devices are always there

    def getData(self, UID, param="ignored"):
        """ Extracts all data for specific UID. Checks whether to update data,
        flip data, or return previous data, and returns correct appropriate
        data.
        """
        tp = self.v.get_device_type(UID)
        if tp == "force_sensor":
            return self.v.get_force_sensor(UID), 0.0

class Grizzly(object):
    @staticmethod
    def get_all_ids():
        res = []
        v = VRepInterface.get_interface()
        for name in v.hw_info:
            if v.get_device_type(name) == "motor":
                res.append(v)
        return res

    def __init__(self, addr):
        self.v = VRepInterface.get_interface()
        self.name = addr

    def set_mode(self, *args):
        pass

    def set_target(self, val):
        self.v.set_motor(self.name, val)

class ControlMode(object):
    NO_PID = None
class DriveMode(object):
    DRIVE_COAST = None
class usb(object):
    USBError = IOError
