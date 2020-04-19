"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/node");
require('dotenv/config');
class SemanticErrorSentry {
    constructor() {
        this.rootPathJSON = __dirname;
        this.rootPathJSON = (process.env.PATH_PACKAGE_SON) ? process.env.PATH_PACKAGE_SON : this.rootPathJSON;
        this.setTagReleaseVersion();
        this.setNamePackage();
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENVIRONMENT,
        });
        Sentry.configureScope((scope) => {
            scope.setTag('Release', this.tagVersion);
            scope.setTag('Name Package', this.tagNamePackage);
        });
        console.log('Release', this.tagVersion);
        console.log('Name Package', this.tagNamePackage);
        console.log('NODE_ENV', process.env.NODE_ENV);
        console.log('SENTRY_DSN', process.env.SENTRY_DSN);
        console.log(`__DIRNAME: ${__dirname}`);
    }
    getSentry() {
        return Sentry;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SemanticErrorSentry();
        }
        return new SemanticErrorSentry();
    }
    semanticErrorReport(error, isToSend = true, parent, service, args, user) {
        Sentry.withScope((scope) => {
            if (user) {
                scope.setUser(user);
            }
            scope.setTag('Release', this.tagVersion);
            scope.setTag('Name Package', this.tagNamePackage);
            if (service) {
                scope.setTag('service', service);
            }
            if (parent) {
                scope.setTag('Parent', parent);
            }
            if (args) {
                scope.setExtra('args', args);
            }
            isToSend ? Sentry.captureException(error) : console.log(error);
        });
        return error;
    }
    setNamePackage() {
        this.tagNamePackage = require(`${this.rootPathJSON}/../../../package.json`).name;
        if (!this.tagNamePackage) {
            throw new Error('Please specify the propertie "name": in package.json');
        }
    }
    setTagReleaseVersion() {
        this.tagVersion = require(`${this.rootPathJSON}/../../../package.json`).version;
        if (!this.tagVersion) {
            throw new Error('Please specify the propertie "version": in package.json');
        }
    }
}
exports.default = SemanticErrorSentry.getInstance();
//# sourceMappingURL=SemanticErrorSentry.js.map