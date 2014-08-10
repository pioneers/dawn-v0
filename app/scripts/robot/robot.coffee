'use strict'

angular.module('daemon.robot', ['daemon.radio', 'daemon.peripheral', 'daemon.gamepad'])

.service('robot', [
  '$interval'
  'radio'
  'gamepads'
  'Peripheral'
  'Gamepad'

  ($interval, radio, gamepads, Peripheral, Gamepad) ->
    _lastContact = Date.now()
    _peripherals = []
    _peripherals.push(new Peripheral(-1, 'Mock Peripheral'))
    _gamepadIndexes = []
    _gamePad = [{
      name: 'noname'
      subPeripherals: -> []
    }]

    listen = ($scope) ->
      $scope.$watch((-> return gamepads.active()), 
        ((newValue, oldValue)->
          if newValue != oldValue
            for g in newValue
              if g.index not in _gamepadIndexes
                _gamepadIndexes.push(g.index)
                gpad = new Gamepad(g, g.id, 'Gamepad ' + g.index)
                _gamePad.push(gpad)
                gamepads.onUpdate(gpad.update)), true)

    _gamePad.push(new Gamepad({index: 1}, 5, 'Gamepad' + 2))
    console.log _gamePad[1].subPeripherals()

    updateLastContact = ->
      _lastContact = Date.now()

    findPeripheral = (properties) ->
      switch typeof properties
        when 'number' then _.findWhere(_peripherals, id: properties)
        else # assume object
          _.findWhere(_peripherals, properties)


    radio.init()
    radio.enableMock()
    radio.onReceive('mock', (channel, update) ->
      updateLastContact()
      findPeripheral(-1).update channel, update
    )

    return {
      lastContact: ->
        return _lastContact
      peripherals: ->
        return _peripherals
      peripheral: findPeripheral
      gamePad: _gamePad
      listen: listen
    }
  ])
