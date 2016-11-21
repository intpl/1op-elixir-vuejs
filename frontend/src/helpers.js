import { Socket } from './phoenix'
import sha512 from 'js-sha512'

export function roomIdFromHref () {
  // TODO: add error reporting if url has more than one room id (e.g. /asdasd#asdasd)
  const regexArr = window.location.href.match(/.*:\/\/.*.*\/#*(.+)/)
  return regexArr ? regexArr[1] : null
}

export function openSocket () {
  const socket = new Socket('wss://ws.1op.eu/socket')
  socket.connect()
  return socket
}

export function prepareChannel ({socket, roomId, password, encryptedRsaPub}) {
  return socket.channel(
    'room:' + roomId, {
      params: {
        sha512: sha512(password),
        rsa_pub: encryptedRsaPub
      }}
  )
}
