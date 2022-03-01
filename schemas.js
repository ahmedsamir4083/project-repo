const { json } = require('express');
const Joi = require('joi');

module.exports.userschema = Joi.object({
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    username: Joi.string().required().alphanum().min(3).max(30),
    mobileNum: Joi.string().required(),
    Email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    Password: Joi.string().required().pattern(new RegExp('^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&?@"]).*$')).message('Invalid Password!'),
    // nationalId: Joi.number().required().integer().min(14),
    birthDate: Joi.date().required(),
});

