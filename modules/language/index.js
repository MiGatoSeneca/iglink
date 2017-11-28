/*
 * language
 * Copyright(c) 2017 Pablo Gutierrez
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
var acceptLanguage = require('accept-language');

/**
 * Module exports.
 * @public
 */

/**
 * Parse Cookie header and populate `req.cookies`
 * with an object keyed by the cookie names.
 *
 * @return {lang}
 * @public
 */


exports = module.exports = function (opts) {
    return function language (req, res, next) {

        acceptLanguage.languages(['es-ES', 'en-US']);

        var defaultLang = 'en_US';
        req.lang = "";
        if(req.query !== undefined && req.query.lang !== undefined){
            req.lang = req.query.lang;
        }else if(req.cookies !== undefined && req.cookies.language !== undefined){
            req.lang = req.cookies.lang;
        }else{
            req.lang = acceptLanguage.get(req.headers['accept-language']).replace('-','_');
        }
        if((req.lang !='es_ES') && (req.lang != 'en_US')){
            req.lang = defaultLang;
        }
        res.cookie('lang',req.lang, { maxAge: 126144000000 });
        next();
    };
};