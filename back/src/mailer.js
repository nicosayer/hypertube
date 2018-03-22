const express = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ericnicogor@gmail.com',
		pass: 'ericnicogor42'
	}
});

module.exports = transporter;