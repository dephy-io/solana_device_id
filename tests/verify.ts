import { keccak256 } from "npm:ethereum-cryptography/keccak.js"
import * as ethUtil from "npm:@ethereumjs/util";
import * as ethSigUtil from "npm:@metamask/eth-sig-util";

const devicePrivateKey = ethUtil.hexToBytes("0x1111111111111111111111111111111111111111111111111111111111111111")
const devicePublicKey = ethUtil.privateToPublic(devicePrivateKey)
const deviceEthAddress = ethUtil.bytesToHex(ethUtil.privateToAddress(devicePrivateKey))

console.log(`Device private key: ${ethUtil.bytesToHex(devicePrivateKey)}`)
console.log(`Device public key: ${ethUtil.bytesToHex(devicePublicKey)}`)
console.log(`Device ETH address: ${deviceEthAddress}`)
console.log("")

// Prepare pre-signed EIP-191 signature that will use to activate the device

const messageForActivation = new TextEncoder().encode("DEPHY")
const hashedMessageForActivation = keccak256(messageForActivation)
const { r: r1, s: s1, v: v1 } = ethUtil.ecsign(hashedMessageForActivation, devicePrivateKey)

console.log(`Message for activation: ${ethUtil.bytesToHex(messageForActivation)}`)
console.log(`Message hash for activation: ${ethUtil.bytesToHex(hashedMessageForActivation)}`)
console.log(`v: ${v1} r: ${ethUtil.bytesToHex(r1)} s: ${ethUtil.bytesToHex(s1)}`)
console.log("")

const pubKeyByte = ethUtil.ecrecover(hashedMessageForActivation, v1, r1, s1)
const ethAddrByte = ethUtil.publicToAddress(pubKeyByte)

const pubKey = ethUtil.bytesToHex(pubKeyByte)
const ethAddr = ethUtil.bytesToHex(ethAddrByte)

console.log()
console.log("public key: ", pubKey)
console.log("eth address: ", ethAddr)

console.log(devicePublicKey.toString() == pubKey.toString()) // 竟然是 false
console.log(deviceEthAddress == ethAddr)
