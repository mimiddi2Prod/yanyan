var fs = require('fs');
var NodeRSA = require('node-rsa')

function generator() {
	var key = new NodeRSA({ b: 512 })
	key.setOptions({ encryptionScheme: 'pkcs1' })
	var privatePem = key.exportKey('pkcs1-private-pem')
	var publicPem = key.exportKey('pkcs1-public-pem')
	fs.writeFile('D:/wxmini/free/pem/public.pem', publicPem, (err) => {
		if (err) throw err
		console.log('公钥已保存！')
	})
	fs.writeFile('D:/wxmini/free/pem/private.pem', privatePem, (err) => {
		if (err) throw err
		console.log('私钥已保存！')
	})
}
// generator();

function encrypt() {
	fs.readFile('D:/wxmini/free/pem/private.pem', function (err, data) {
		var key = new NodeRSA(data);
		let cipherText = key.encryptPrivate('hello world', 'base64');
		console.log(cipherText);
	});
}
// encrypt();
// L8NWHa2K3QpIEnWShGl+4fymXe7w9loSls7rAd0n29bzQaiglsP0VUmS9z+q0v6XtkoLUnCxM5yBsE67/OiSJg==
function decrypt() {
	fs.readFile('D:/wxmini/free/pem/public.pem', function (err, data) {
		var key = new NodeRSA(data);
		let src = "P4Q9OadJFsoJt+SznJ+H5Mz0rHF09UFqqaal5SaC5AZ3vIB/1j3TcIZ1UW38CozjwaLEqTbU1HQRmkH21Nyd+Q=="
		src = src.replace(/\s+/g, '+')
		console.info(src)
		let rawText = key.decrypt(src, 'utf8');
		console.log(rawText);
	});
}
//generator();
//encrypt();
//decrypt();
const crypto = require('crypto')
const  publicKey = fs.readFileSync('D:/wxmini/free/pem/public.pem').toString('utf-8')
//console.info(publicKey)
function decr(){
	const  privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
		"MIIBOQIBAAJBAIpZYxLs3J5FAIe2MFrK5+0PpeaYRGPoLm5UqjuSp6yCiJbQTt8t\n" +
		"OU0ruhQnTGEmfcNChQrzexnTyWi7eMwfzG0CAwEAAQJAZj+yDWaplv+AaMyp6DBW\n" +
		"QMpz3n1i7kPHLRu9xNGaws+QIa0fVz6U6eHJ5ChndZddL9sHCCyFamdjgUgc2CCw\n" +
		"sQIhAMQOsZ6qlLmIJ06vAtt3mLDQpSXhe+mKm9DGVXgWP5ETAiEAtKXmvjherUNi\n" +
		"u2eVJbkq7d5sdOZC4EYxPPsLwq48XH8CIBrKEzUmA9pyI0TaHx7T8bY/XEGX1PGt\n" +
		"cesOHsGg8KCnAiAPRrA6ib3H3RjuTBYauIvezZ5STF5/ZLApPfmCnwVPtQIgfBta\n" +
		"RssulXQDbFcNFMepqMrSnpmDLuFOgBfg7UwFcWI=\n" +
		"-----END RSA PRIVATE KEY-----"
	let src = "ugrG7b7IKR6AhQ9a0ZiDFC2uEg9mJiN3ILLLFeu4owsscPR+CeBWzsDu34S4emtHOrxPqlPFsgcI6P7g7ss5"
	src  = src.replace(/\s+/g, '+')
	let buffer2 = new Buffer(src, 'base64')
	let decrypted = crypto.privateDecrypt({
			key: privateKey,
			padding: crypto.constants.RSA_PKCS1_PADDING
		},
		buffer2
	)
	console.info(decrypted.toString('utf-8'))
}

// decr()

function  publicDesc() {
	let src = "Jkd8SqHEIBlgLnfucOKFLFgJ4c5NkGEQ0uZx9dbbACn0hY4u6euk/hJ6ibqpG3M6yd3E8gt/TGSXme+ggoVaQg=="
	src  = src.replace(/\s+/g, '+')
}

function createPublicKey(){
	var key = new NodeRSA({b: 512});
	var publicDer = key.exportKey('public');
	var privateDer = key.exportKey('private');
	console.log('公钥:',publicDer);
	console.log('私钥:',privateDer);
}

//createPublicKey()