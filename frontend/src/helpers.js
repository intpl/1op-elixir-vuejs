export function roomIdFromHref () {
  // TODO: add error reporting if url has more than one room id (e.g. /asdasd#asdasd)
  const regexArr = window.location.href.match(/.*:\/\/.*.*\/#*(.+)/)
  return regexArr ? regexArr[1] : null
}

export function roomIdToHref (roomId) {
  if (roomId !== roomIdFromHref()) {
    window.location.hash = roomId
  }
}
