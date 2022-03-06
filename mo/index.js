// LQM2cgxC6j
const bs58 = require('bs58')

const address = '2Lg3b2UdD4hzrxHpcwhgShuUdccTKFoo2doAUZawEdPH'
console.log(bs58.decode(address))
const data = Buffer.from(bs58.decode(address))
console.log(data)
const magic = data.readUInt32LE(0)

  // program version
  const version = data.readUInt32LE(4)
  // account type
  const type = data.readUInt32LE(8)
  // account used size
  const size = data.readUInt32LE(12)
  console.log({ magic, version, type, size })